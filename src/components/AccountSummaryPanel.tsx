import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { UserData } from "@/utils/csvParser";
import { ModelPrediction } from "@/utils/botDetection";

interface AccountSummaryPanelProps {
  userData: UserData;
  predictions: ModelPrediction[];
}

const AccountSummaryPanel = ({ userData, predictions }: AccountSummaryPanelProps) => {
  const botVotes = predictions.filter((p) => p.isBot).length;
  const overallIsBot = botVotes >= 2;

  const getModelName = (idx: number) =>
    idx === 0
      ? "Isolation Forest"
      : idx === 1
        ? "One-Class SVM"
        : idx === 2
          ? "Elliptic Envelope"
          : "LOF";

  const getModelColor = (idx: number) =>
    idx === 0
      ? "#4C39E8"
      : idx === 1
        ? "#21C7DE"
        : idx === 2
          ? "#F4A22A"
          : "#19C45A";

  return (
    <section className="pt-4 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border border-border">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <CardTitle className="text-lg md:text-xl">{userData.author_name}</CardTitle>
              </div>

              {overallIsBot ? (
                <Badge variant="destructive" className="flex items-center gap-1 self-start sm:self-center">
                  <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" /> Suspicious
                </Badge>
              ) : (
                <Badge variant="default" className="flex items-center gap-1 bg-green-600 text-white hover:bg-green-600/90 self-start sm:self-center">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" /> Human
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm md:text-base">Summary and model verdicts</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div className="text-xs sm:text-sm">
                <p className="text-muted-foreground">Total karma</p>
                <p className="font-semibold">{userData.total_karma}</p>
              </div>
              <div className="text-xs sm:text-sm">
                <p className="text-muted-foreground">Account age</p>
                <p className="font-semibold">{userData.account_age_days} days</p>
              </div>
              <div className="text-xs sm:text-sm">
                <p className="text-muted-foreground">Verified email</p>
                <p className="font-semibold flex items-center gap-1">
                  {userData.has_verified_email ? (
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                  )}
                  {userData.has_verified_email ? "Yes" : "No"}
                </p>
              </div>
              <div className="text-xs sm:text-sm">
                <p className="text-muted-foreground">Subreddit diversity</p>
                <p className="font-semibold">{userData.subreddit_diversity}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold mb-2">Model verdicts</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {predictions.map((p, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border rounded px-2 sm:px-3 py-2 gap-1 sm:gap-0">
                    <div className="flex items-center gap-2">

                      {/* Color dot */}
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: getModelColor(idx) }}
                      />

                      {/* Correct model name */}
                      <span className="text-xs sm:text-sm">
                        {getModelName(idx)}
                      </span>
                    </div>

                    {/* Verdict + Confidence */}
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      {p.isBot ? (
                        <Badge variant="destructive" className="text-xs">Bot</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">Human</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        conf: {(p.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AccountSummaryPanel;
