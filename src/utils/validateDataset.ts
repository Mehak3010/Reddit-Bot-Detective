import Papa from "papaparse";

export interface DatasetValidationResult {
  valid: boolean;
  errors: string[];        // warnings only
  recordCount: number;
  header: string[];
  rows: any[];             // parsed & normalized rows
}

export function validateDataset(csvText: string): DatasetValidationResult {
  const requiredColumns = [
    "author_name",
    "comment",
    "score",
    "subreddit",
    "timestamp"
  ];

  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

  const originalHeader = parsed.meta.fields || [];
  const errors: string[] = [];

  if (!originalHeader.length) {
    return {
      valid: true,
      errors: ["CSV file has no header row — all data will be null"],
      recordCount: 0,
      header: requiredColumns,   // fallback header
      rows: [],
    };
  }

  // Build final header = original + missing required columns
  const finalHeader = [...originalHeader];

  for (const col of requiredColumns) {
    if (!finalHeader.includes(col)) {
      finalHeader.push(col);   // auto-add missing
      errors.push(`Missing required column: "${col}" — value will be set to null`);
    }
  }

  // Normalize rows: ensure every row has all required fields
  const normalizedRows = (parsed.data as any[]).map(row => {
    const clean = { ...row };

    for (const col of requiredColumns) {
      if (!(col in clean)) clean[col] = null;
    }

    return clean;
  });

  // Count non-empty rows
  const recordCount = normalizedRows.filter(row =>
    Object.values(row).some(v => v !== null && v !== "")
  ).length;

  return {
    valid: true,           // NEVER block upload
    errors,                // warnings only
    recordCount,
    header: finalHeader,
    rows: normalizedRows
  };
}
