import { useState } from "react";
import ModelComparison from "@/components/ModelComparison";
import ModelDetails from "@/components/ModelDetails";

type Props = {
  performanceData: any[];
  radarData: any[];
  detectionTrend: any[];
  analysisPerformed: boolean;
};

const MobilePerformanceTabs = ({ performanceData, radarData, detectionTrend, analysisPerformed }: Props) => {
  const [tab, setTab] = useState<"comparison" | "details">("comparison");

  return (
    <section className="md:hidden px-4 pt-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Performance Metrics</h2>
          <div className="inline-flex rounded-md border border-border overflow-hidden">
            <button
              className={`px-3 py-1 text-sm ${tab === "comparison" ? "bg-primary text-primary-foreground" : "bg-background text-foreground"}`}
              onClick={() => setTab("comparison")}
            >
              Comparison
            </button>
            <button
              className={`px-3 py-1 text-sm border-l border-border ${tab === "details" ? "bg-primary text-primary-foreground" : "bg-background text-foreground"}`}
              onClick={() => setTab("details")}
            >
              Deep Dive
            </button>
          </div>
        </div>

        <div className="relative border rounded-lg">
          <div
            className={`flex transition-transform duration-300 ease-in-out`}
            style={{ transform: tab === "comparison" ? "translateX(0%)" : "translateX(-100%)" }}
          >
            <div className="min-w-full">
              <ModelComparison
                performanceData={performanceData}
                radarData={radarData}
                detectionTrend={detectionTrend}
              />
            </div>
            <div className="min-w-full">
              <ModelDetails
                performanceData={analysisPerformed ? performanceData : []}
                radarData={analysisPerformed ? radarData : []}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobilePerformanceTabs;