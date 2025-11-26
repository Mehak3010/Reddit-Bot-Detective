import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

const AnalysisPlaceholder = () => {
  return (
    <section className="pt-4 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border border-dashed">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Analyze a username</CardTitle>
            </div>
            <CardDescription>Enter a Reddit username above to see their summary and model verdicts.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Once analyzed, account details and model predictions will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AnalysisPlaceholder;