import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  LineChart as ReLineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

type PerformanceSwitcherProps = {
  performanceData: any[];
  radarData: any[];
  detectionTrend: any[];
};

const PerformanceSwitcher = ({ performanceData, radarData, detectionTrend }: PerformanceSwitcherProps) => {
  return (
    <section className="pt-4 pb-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="metrics">
          <Card>
            <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <CardTitle className="text-lg md:text-xl">Model Performance Comparison</CardTitle>
              <TabsList className="w-full md:w-auto grid grid-cols-3 md:flex md:flex-row gap-1 md:gap-0">
                <TabsTrigger value="metrics" className="text-xs md:text-sm">Metrics</TabsTrigger>
                <TabsTrigger value="characteristics" className="text-xs md:text-sm">Characteristics</TabsTrigger>
                <TabsTrigger value="trend" className="text-xs md:text-sm">Detection Trend</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="metrics">
                <div className="w-full overflow-x-auto">
                  <ReBarChart width={320} height={280} data={performanceData} className="min-w-[320px]">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" fontSize={12} />
                    <YAxis domain={[0, 1]} fontSize={12} />
                    <ReTooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="isolation" name="Isolation Forest" fill="#4f46e5" />
                    <Bar dataKey="svm" name="One-Class SVM" fill="#06b6d4" />
                    <Bar dataKey="elliptic" name="Elliptic Envelope" fill="#f59e0b" />
                    <Bar dataKey="lof" name="LOF" fill="#10b981" />
                  </ReBarChart>
                </div>
              </TabsContent>

              <TabsContent value="characteristics">
                <div className="w-full overflow-x-auto">
                  <ReRadarChart width={320} height={280} data={radarData} className="min-w-[320px]">
                    <PolarGrid />
                    <PolarAngleAxis dataKey="feature" fontSize={12} />
                    <Radar dataKey="isolation" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                    <Radar dataKey="svm" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                    <Radar dataKey="elliptic" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
                    <Radar dataKey="lof" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                  </ReRadarChart>
                </div>
              </TabsContent>

              <TabsContent value="trend">
                <div className="w-full overflow-x-auto">
                  <ReLineChart width={320} height={280} data={detectionTrend} className="min-w-[320px]">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="threshold" fontSize={12} />
                    <YAxis fontSize={12} />
                    <ReTooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="isolation" stroke="#4f46e5" />
                    <Line type="monotone" dataKey="svm" stroke="#06b6d4" />
                    <Line type="monotone" dataKey="elliptic" stroke="#f59e0b" />
                    <Line type="monotone" dataKey="lof" stroke="#10b981" />
                  </ReLineChart>
                </div>
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </section>
  );
};

export default PerformanceSwitcher;