import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from "recharts";

interface ModelComparisonProps {
  performanceData: any[];
  radarData: any[];
  detectionTrend: any[];
}

const ModelComparison = ({ performanceData, radarData, detectionTrend }: ModelComparisonProps) => {
  return (
    <section className="pt-4 pb-12 px-4 md:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Model Performance Comparison</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Comparing key evaluation metrics across all four models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="metric" className="text-xs" />
                  <YAxis domain={[0, 1]} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                  <Bar dataKey="isolation" name="Isolation Forest" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="svm" name="One-Class SVM" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="elliptic" name="Elliptic Envelope" fill="hsl(var(--chart-3))" />
                  <Bar dataKey="lof" name="LOF" fill="hsl(var(--chart-4))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Characteristics</CardTitle>
              <CardDescription>
                Comparative analysis of model attributes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid className="stroke-muted" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="feature" className="text-xs" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Radar name="Isolation Forest" dataKey="isolation" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="hsl(var(--chart-1))" fillOpacity={0.3} dot={{ r: 3 }} />
                  <Radar name="One-Class SVM" dataKey="svm" stroke="hsl(var(--chart-2))" strokeWidth={2} fill="hsl(var(--chart-2))" fillOpacity={0.3} dot={{ r: 3 }} />
                  <Radar name="Elliptic Envelope" dataKey="elliptic" stroke="hsl(var(--chart-3))" strokeWidth={2} fill="hsl(var(--chart-3))" fillOpacity={0.3} dot={{ r: 3 }} />
                  <Radar name="LOF" dataKey="lof" stroke="hsl(var(--chart-4))" strokeWidth={2} fill="hsl(var(--chart-4))" fillOpacity={0.3} dot={{ r: 3 }} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Detection Rate vs. Confidence Threshold</CardTitle>
              <CardDescription>
                How detection rates change with varying confidence thresholds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={detectionTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="threshold" label={{ value: 'Confidence Threshold (%)', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Detection Rate (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="isolation" name="Isolation Forest" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="svm" name="One-Class SVM" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="elliptic" name="Elliptic Envelope" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="lof" name="LOF" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ModelComparison;
