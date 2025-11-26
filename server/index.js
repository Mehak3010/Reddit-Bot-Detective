import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import db from "./sqlite.js";
import supabase from "./supabase.js";

const app = express();
const PORT = process.env.PORT || 3001;

/* -----------------------------------------------------
   ALLOW VERY LARGE REQUESTS (500MB)
----------------------------------------------------- */
app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));

/* -----------------------------------------------------
   MULTER — ALLOW 500 MB UPLOADS
----------------------------------------------------- */
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 500 * 1024 * 1024 } // 500 MB
});

/* -----------------------------------------------------
   INIT SQLITE (fallback)
----------------------------------------------------- */
db.init();

/* -----------------------------------------------------
   HEALTH CHECK
----------------------------------------------------- */
app.get("/health", (req, res) => res.json({ ok: true }));

/* -----------------------------------------------------
   GET USERS
----------------------------------------------------- */
app.get("/users", async (req, res) => {
  try {
    const dataset = req.query?.dataset?.toString().trim() || "";
    let users = [];

    // Try Supabase
    if (supabase) {
      try {
        let query = supabase
          .from("users")
          .select("id, username, verified, source, meta")
          .order("id", { ascending: false });

        if (dataset) query = query.eq("source", dataset);

        const { data, error } = await query;

        if (!error && Array.isArray(data)) {
          users = data.map((r) => ({
            id: r.id,
            username: r.username,
            verified: !!r.verified,
            source: r.source,
            meta:
              typeof r.meta === "string"
                ? JSON.parse(r.meta || "{}")
                : r.meta || {}
          }));
        }
      } catch (e) {
        console.log("Supabase failed → SQLite fallback");
      }
    }

    // SQLite fallback
    if (!users.length) {
      const sql = dataset
        ? "SELECT id, username, verified, source, meta FROM users WHERE source = ? ORDER BY id DESC"
        : "SELECT id, username, verified, source, meta FROM users ORDER BY id DESC";

      const params = dataset ? [dataset] : [];
      const rows = await db.all(sql, params);

      users = rows.map((r) => ({
        id: r.id,
        username: r.username,
        verified: !!r.verified,
        source: r.source,
        meta: r.meta ? JSON.parse(r.meta) : {}
      }));
    }

    res.json({ users });
  } catch {
    res.json({ users: [] });
  }
});

/* -----------------------------------------------------
   GET DATASETS — FIX NAME SANITIZATION
----------------------------------------------------- */
app.get("/datasets", async (req, res) => {
  try {
    let datasets = [];

    if (supabase) {
      const { data, error } = await supabase
        .from("datasets")
        .select("name, record_count");

      if (!error && Array.isArray(data)) {
        datasets = data.map((d) => {
          // sanitize bad dataset names
          const cleanName = String(d.name || "")
            .replace(/\.csv$/i, "")
            .replace(/[^a-zA-Z0-9-_]/g, "_");

          return {
            name: cleanName,
            count: d.record_count || 0
          };
        });
      }
    }

    // SQLite fallback
    if (!datasets.length) {
      const rows = await db.all(
        "SELECT source AS name, COUNT(*) AS count FROM users GROUP BY source"
      );

      datasets = rows.map((r) => ({
        name: String(r.name || "")
          .replace(/\.csv$/i, "")
          .replace(/[^a-zA-Z0-9-_]/g, "_"),
        count: r.count
      }));
    }

    res.json({ datasets });
  } catch (e) {
    res.json({ datasets: [] });
  }
});

/* -----------------------------------------------------
   STREAMING CSV UPLOAD — SAFE + NULL FIX
----------------------------------------------------- */
app.post("/upload-dataset", upload.single("file"), async (req, res) => {
  const datasetNameRaw =
    req.body?.datasetName || req.file?.originalname || "uploaded-dataset";

  const filePath = req.file?.path;
  if (!filePath) return res.status(400).json({ error: "No file provided" });

  // Clean dataset name properly
  const safeName = String(datasetNameRaw)
    .replace(/\.csv$/i, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_");

  const originalName = req.file.originalname;

  try {
    let importedCount = 0;

    /* -----------------------------------------------------
       1. Upload full raw file to Supabase STORAGE
    ----------------------------------------------------- */
    let publicUrl = null;
    let storagePath = null;

    if (supabase) {
      const buffer = await fs.promises.readFile(filePath);

      storagePath = `${safeName}/${Date.now()}-${originalName}`;

      const { error } = await supabase.storage
        .from("datasets")
        .upload(storagePath, buffer, {
          contentType: "text/csv",
          upsert: true
        });

      if (!error) {
        const { data: pub } = supabase.storage
          .from("datasets")
          .getPublicUrl(storagePath);
        publicUrl = pub?.publicUrl || null;
      }
    }

    /* -----------------------------------------------------
       2. STREAM CSV ROWS → INSERT ONE BY ONE
    ----------------------------------------------------- */
    await new Promise((resolve, reject) => {
      const stream = fs
        .createReadStream(filePath)
        .pipe(parse({ columns: true }))
        .on("data", async (row) => {
          stream.pause();

          const username =
            row.author_name?.trim() ||
            row.username?.trim() ||
            null;

          if (username) {
            // auto-null missing fields
            Object.keys(row).forEach((k) => {
              if (row[k] === "" || row[k] === undefined) row[k] = null;
            });

            const meta = JSON.stringify(row);

            if (supabase) {
              await supabase.from("users").upsert(
                {
                  username,
                  verified: false,
                  source: safeName,
                  meta
                },
                { onConflict: "username" }
              );
            } else {
              await db.run(
                "INSERT INTO users (username, verified, source, meta) VALUES (?, 0, ?, ?) ON CONFLICT(username) DO UPDATE SET meta=excluded.meta",
                [username, safeName, meta]
              );
            }

            importedCount++;
          }

          stream.resume();
        })
        .on("end", resolve)
        .on("error", reject);
    });

    /* -----------------------------------------------------
       3. INSERT dataset entry in Supabase.datasets
    ----------------------------------------------------- */
    if (supabase) {
      await supabase.from("datasets").upsert({
        name: safeName,
        storage_path: storagePath,
        public_url: publicUrl,
        record_count: importedCount
      });
    }

    fs.unlink(filePath, () => { });
    res.json({
      ok: true,
      datasetName: safeName,
      importedCount,
      storagePath,
      publicUrl
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process dataset" });
  }
});

/* -----------------------------------------------------
   VERIFIED ACCOUNTS
----------------------------------------------------- */
app.post("/verified-accounts", async (req, res) => {
  const usernames = Array.isArray(req.body?.usernames)
    ? req.body.usernames
    : [];

  if (!usernames.length)
    return res.status(400).json({ error: "Provide usernames array" });

  try {
    for (const u of usernames) {
      await supabase.from("users").upsert(
        {
          username: u,
          verified: true,
          source: "manual-verified"
        },
        { onConflict: "username" }
      );
    }

    res.json({ ok: true, count: usernames.length });
  } catch {
    res.status(500).json({ error: "Failed to mark verified users" });
  }
});

/* -----------------------------------------------------
   START SERVER
----------------------------------------------------- */
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
