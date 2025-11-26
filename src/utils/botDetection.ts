import { UserData } from "./csvParser";

export interface ModelPrediction {
  model: string;
  isBot: boolean;
  confidence: number;
}

export const modelNames = ["Isolation Forest", "One-Class SVM", "Elliptic Envelope", "LOF"];

export function analyzeUser(user: UserData): ModelPrediction[] {
  const preds: ModelPrediction[] = [];

  // Simple anomaly heuristics (your old logic)
  const suspiciousScore =
    (user.comment_karma < 10 ? 1 : 0) +
    (user.subreddit_diversity < 3 ? 1 : 0) +
    (user.username_has_number ? 1 : 0) +
    (user.account_age_days < 15 ? 1 : 0);

  const scoreNorm = suspiciousScore / 4;

  // Create 4 model variations for dynamic graphs
  modelNames.forEach((m, idx) => {
    const threshold = 0.3 + idx * 0.12; // each model slightly different sensitivity
    preds.push({
      model: m,
      isBot: scoreNorm >= threshold,
      confidence: scoreNorm
    });
  });

  return preds;
}
