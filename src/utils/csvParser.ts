
export interface UserData {
  author_name: string;
  author_id: string;
  created_utc: number;
  comment_karma: number;
  link_karma: number;
  total_karma: number;
  has_verified_email: boolean;
  is_mod: boolean;
  is_gold: boolean;
  account_age_days: number;
  karma_per_day: number;
  comment_ratio: number;
  link_ratio: number;
  username_length: number;
  username_has_number: boolean;
  submission_count: number;
  comment_count: number;
  subreddit_diversity: number;
  avg_comment_length: number;
  std_comment_length: number;
  avg_time_between_comments: number;
}

/* Fetch user list from backend API */
const fetchUsersFromAPI = async () => {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";
  const url = `${API_BASE}/users`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch from backend");
  return res.json();
};

/* Normalize Supabase result to UserData */
const mapDBUserToUserData = (row: any): UserData => {
  const meta =
    typeof row.meta === "string" ? JSON.parse(row.meta || "{}") : row.meta || {};

  return {
    author_name: row.username || meta.author_name || "",
    author_id: meta.author_id ?? "",
    created_utc: meta.created_utc ?? 0,
    comment_karma: meta.comment_karma ?? 0,
    link_karma: meta.link_karma ?? 0,
    total_karma: meta.total_karma ?? 0,
    has_verified_email: !!meta.has_verified_email,
    is_mod: !!meta.is_mod,
    is_gold: !!meta.is_gold,
    account_age_days: meta.account_age_days ?? 0,
    karma_per_day: meta.karma_per_day ?? 0,
    comment_ratio: meta.comment_ratio ?? 0,
    link_ratio: meta.link_ratio ?? 0,
    username_length: meta.username_length ?? row.username?.length ?? 0,
    username_has_number: meta.username_has_number ?? /\d/.test(row.username),
    submission_count: meta.submission_count ?? 0,
    comment_count: meta.comment_count ?? 0,
    subreddit_diversity: meta.subreddit_diversity ?? 0,
    avg_comment_length: meta.avg_comment_length ?? 0,
    std_comment_length: meta.std_comment_length ?? 0,
    avg_time_between_comments: meta.avg_time_between_comments ?? 0,
  };
};

/* 🔍 Username Search: Supabase → fallback CSV */
export const searchUserInCSV = async (
  username: string
): Promise<UserData | null> => {
  const clean = username.toLowerCase().trim();

  // 1️⃣ Search Supabase
  try {
    const data = await fetchUsersFromAPI();
    const users = Array.isArray(data?.users) ? data.users : [];
    const match = users.find(
      (u: any) => (u.username || "").toLowerCase() === clean
    );
    if (match) return mapDBUserToUserData(match);
  } catch {}

  // 2️⃣ CSV fallback (default dataset)
  try {
    const response = await fetch("/data/users_parameters_phase1.csv");
    const text = await response.text();
    const lines = text.split("\n");
    const headers = lines[0].split(",");

    const colIndex = {
      name: headers.indexOf("author_name"),
      karma: headers.indexOf("total_karma"),
      comments: headers.indexOf("comment_count"),
      diversity: headers.indexOf("subreddit_diversity"),
    };

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      if (cols[colIndex.name]?.toLowerCase() === clean) {
        return {
          author_name: cols[colIndex.name],
          author_id: "",
          created_utc: 0,
          comment_karma: 0,
          link_karma: 0,
          total_karma: Number(cols[colIndex.karma]) || 0,
          has_verified_email: false,
          is_mod: false,
          is_gold: false,
          account_age_days: 0,
          karma_per_day: 0,
          comment_ratio: 0,
          link_ratio: 0,
          username_length: cols[colIndex.name].length,
          username_has_number: /\d/.test(cols[colIndex.name]),
          submission_count: 0,
          comment_count: Number(cols[colIndex.comments]) || 0,
          subreddit_diversity: Number(cols[colIndex.diversity]) || 0,
          avg_comment_length: 0,
          std_comment_length: 0,
          avg_time_between_comments: 0,
        };
      }
    }
  } catch {}

  return null;
};

/* 📊 Fetch all users for graph analysis — ALWAYS CSV */
export const getUsersFromCSV = async (): Promise<UserData[]> => {
  const response = await fetch("/data/users_parameters_phase1.csv");
  const text = await response.text();

  const lines = text.split("\n");
  const headers = lines[0].split(",");

  const users: UserData[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (!cols[0]) continue;

    users.push({
      author_name: cols[headers.indexOf("author_name")],
      author_id: "",
      created_utc: 0,
      comment_karma: Number(cols[headers.indexOf("comment_karma")]) || 0,
      link_karma: Number(cols[headers.indexOf("link_karma")]) || 0,
      total_karma: Number(cols[headers.indexOf("total_karma")]) || 0,
      has_verified_email: false,
      is_mod: false,
      is_gold: false,
      account_age_days: Number(cols[headers.indexOf("account_age_days")]) || 0,
      karma_per_day: Number(cols[headers.indexOf("karma_per_day")]) || 0,
      comment_ratio: Number(cols[headers.indexOf("comment_ratio")]) || 0,
      link_ratio: Number(cols[headers.indexOf("link_ratio")]) || 0,
      username_length: cols[headers.indexOf("author_name")].length,
      username_has_number: /\d/.test(cols[headers.indexOf("author_name")]),
      submission_count: Number(cols[headers.indexOf("submission_count")]) || 0,
      comment_count: Number(cols[headers.indexOf("comment_count")]) || 0,
      subreddit_diversity:
        Number(cols[headers.indexOf("subreddit_diversity")]) || 0,
      avg_comment_length:
        Number(cols[headers.indexOf("avg_comment_length")]) || 0,
      std_comment_length:
        Number(cols[headers.indexOf("std_comment_length")]) || 0,
      avg_time_between_comments:
        Number(cols[headers.indexOf("avg_time_between_comments")]) || 0,
    });
  }

  return users;
};
