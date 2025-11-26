import { Card } from "@/components/ui/card";

const ModelCards = () => {
  return (
    <section className="py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card className="p-4 border-l-4 border-l-primary hover:shadow-lg transition-shadow">
            <p className="text-base font-semibold text-primary">Isolation Forest</p>
            <p className="text-xs text-muted-foreground mt-1">Tree-based anomaly detection</p>
          </Card>

          <Card className="p-4 border-l-4 border-l-accent hover:shadow-lg transition-shadow">
            <p className="text-base font-semibold text-accent">One-Class SVM</p>
            <p className="text-xs text-muted-foreground mt-1">Support vector boundaries</p>
          </Card>

          <Card className="p-4 border-l-4 border-l-chart-3 hover:shadow-lg transition-shadow">
            <p className="text-base font-semibold text-chart-3">Elliptic Envelope</p>
            <p className="text-xs text-muted-foreground mt-1">Gaussian distribution fitting</p>
          </Card>

          <Card className="p-4 border-l-4 border-l-chart-4 hover:shadow-lg transition-shadow">
            <p className="text-base font-semibold text-chart-4">Local Outlier Factor</p>
            <p className="text-xs text-muted-foreground mt-1">Density-based detection</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ModelCards;
