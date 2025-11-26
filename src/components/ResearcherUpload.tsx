import { useState } from "react";
import { uploadDataset } from "@/utils/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import { validateDataset } from "@/utils/validateDataset";

interface UploadInfo {
  importedCount?: number;
  datasetName: string;
}

const ResearcherUpload = ({ onUploaded }: { onUploaded?: (info: UploadInfo) => void }) => {
  const [datasetName, setDatasetName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [message, setMessage] = useState<string>("");

  const onUpload = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();

    if (!file) {
      setMessage("Please select a CSV file.");
      return;
    }

    // 1️⃣ Read file text
    const csvText = await file.text();

    // 2️⃣ Validate dataset (STEP 2)
    const result = validateDataset(csvText);

    if (!result.valid) {
      setMessage(result.errors.join(" • "));
      return;
    }

    // 3️⃣ Disable UI
    setLoadingUpload(true);
    setMessage("");

    try {
      const safeName = datasetName.trim() || file.name.replace(".csv", "");

      // 4️⃣ Upload dataset (FIXED: added recordCount)
      const response = await uploadDataset(safeName, file, result.recordCount);

      // 5️⃣ Success message
      setMessage(
        `Uploaded "${safeName}" • ${result.recordCount} records validated • Imported ${response.importedCount ?? 0}`
      );

      // 6️⃣ Notify parent
      if (onUploaded) {
        onUploaded({
          importedCount: response.importedCount,
          datasetName: safeName
        });
      }
    } catch (err: any) {
      setMessage(err?.message || "Upload failed");
    } finally {
      setLoadingUpload(false);
    }
  };

  return (
    <section className="pt-6 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="h-6 w-6 text-primary" />
              Upload Your Dataset
            </CardTitle>
            <CardDescription>
              Upload a CSV. It will be validated and stored securely.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Dataset Name */}
            <div className="space-y-2">
              <Label htmlFor="dataset-name">Dataset name (optional)</Label>
              <Input
                id="dataset-name"
                type="text"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="e.g. lab-aug-2025"
              />
            </div>

            {/* File Picker */}
            <div className="space-y-2">
              <Label htmlFor="dataset-file">CSV file</Label>

              <input
                id="dataset-file"
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />

              <label
                htmlFor="dataset-file"
                className="flex flex-col sm:flex-row cursor-pointer items-start sm:items-center justify-between rounded-lg border border-dashed p-3 sm:p-4 gap-3 sm:gap-0"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  <div className="text-xs sm:text-sm">
                    {file ? (
                      <span className="font-medium break-all">{file.name}</span>
                    ) : (
                      <span className="text-muted-foreground">Click to choose a CSV file</span>
                    )}
                  </div>
                </div>

                <Button variant="outline" type="button" className="w-full sm:w-auto">
                  Browse
                </Button>
              </label>
            </div>
          </CardContent>

          <CardFooter className="flex items-center gap-3">
            <Button type="submit" onClick={onUpload} disabled={loadingUpload}>
              {loadingUpload ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading
                </>
              ) : (
                <>
                  <UploadCloud className="h-4 w-4" />
                  Upload dataset
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {message && (
          <div className="mt-4">
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResearcherUpload;
