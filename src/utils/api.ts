import { supabase } from "../integrations/supabase/client";

/**
 * Upload a dataset:
 * 1. Uploads CSV file → Supabase Storage
 * 2. Writes row → datasets table
 * 3. Returns storage paths & record count
 */
export async function uploadDataset(datasetName: string, file: File, recordCount: number) {
  try {
    const safeName = datasetName.replace(/\s+/g, "-").toLowerCase();
    const fileName = `${safeName}.csv`;

    // 1️⃣ Upload CSV to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("datasets")               // storage bucket
      .upload(`csv/${fileName}`, file, {
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 2️⃣ Insert dataset metadata into Supabase
    const { error: dbError } = await supabase.from("datasets").upsert({
      name: safeName,
      file_path: uploadData.path,
      record_count: recordCount,
      upload_date: new Date().toISOString(),
    });

    if (dbError) throw dbError;

    // 3️⃣ Generate a public file URL
    const { data: urlData } = supabase.storage
      .from("datasets")
      .getPublicUrl(`csv/${fileName}`);

    return {
      storagePath: uploadData.path,
      publicUrl: urlData.publicUrl,
      importedCount: recordCount,
    };
  } catch (err) {
    console.error("Upload dataset failed:", err);
    throw err;
  }
}

/**
 * Fetch list of datasets from Supabase
 */
export async function getDatasets() {
  const { data, error } = await supabase
    .from("datasets")
    .select("name, record_count");

  if (error) throw error;

  return { datasets: data || [] };
}

/**
 * Load a CSV dataset from Supabase Storage
 */
export async function downloadDatasetCSV(datasetName: string): Promise<string> {
  const fileName = datasetName.replace(/\s+/g, "-").toLowerCase() + ".csv";

  const { data, error } = await supabase.storage
    .from("datasets")
    .download(`csv/${fileName}`);

  if (error) throw error;

  return await data.text();
}

/**
 * Query to load users from CSV (handled in FE)
 */
export async function getUsersFromDataset(datasetName: string): Promise<string> {
  return await downloadDatasetCSV(datasetName);
}
