import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { searchUserInCSV, UserData } from "@/utils/csvParser";
import { analyzeUser, ModelPrediction } from "@/utils/botDetection";
import { toast } from "sonner";
import { z } from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDatasets } from "@/utils/api";

const usernameSchema = z.string()
  .trim()
  .min(1, { message: "Username cannot be empty" })
  .max(50, { message: "Username must be less than 50 characters" })
  .regex(/^[a-zA-Z0-9_-]+$/, { message: "Username can only contain letters, numbers, underscores, and hyphens" });

interface Props {
  onSummary?: (user: UserData | null, predictions: ModelPrediction[]) => void;
}

const UserAnalysisSection = ({ onSummary }: Props) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState<{ name: string; count: number }[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('all');

  useEffect(() => {
    (async () => {
      try {
        const res = await getDatasets();
        const list = Array.isArray(res?.datasets)
          ? res.datasets.map((d: any) => ({
            name: d.name,
            count: Number(d.record_count) || 0,
          }))
          : [];
        setDatasets(list);
      } catch {
        console.warn("Dataset fetch failed → CSV fallback is OK.");
        setDatasets([]);
      }
    })();
  }, []);

  const handleSearch = async () => {
    try {
      const validatedUsername = usernameSchema.parse(username);
      setLoading(true);

      const user = await searchUserInCSV(validatedUsername);

      if (user) {
        const preds = analyzeUser(user);
        onSummary?.(user, preds);
        toast.success(`Analysis completed: ${user.author_name}`);
      } else {
        onSummary?.(null, []);
        toast.error("User not found in dataset");
      }

    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Error analyzing user");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex w-full flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter Reddit username (e.g., RayesArmstrong)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-10 text-sm sm:text-base"
          />
        </div>

        <div className="w-full sm:w-64">
          <Select value={selectedDataset} onValueChange={setSelectedDataset}>
            <SelectTrigger>
              <SelectValue placeholder="All datasets" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All datasets</SelectItem>
              {datasets.map((d) => (
                <SelectItem key={d.name} value={d.name}>
                  {d.name} ({d.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSearch} disabled={loading} className="w-full sm:w-auto">
          {loading ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
    </div>
  );
};

export default UserAnalysisSection;
