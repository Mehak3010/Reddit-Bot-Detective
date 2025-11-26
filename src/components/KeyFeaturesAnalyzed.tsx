import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const KeyFeaturesAnalyzed = () => {
  return (
    <section className="pt-4 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Key Features Analyzed</h2>
        <Card>
          <CardHeader>
            <CardTitle>What the models look at</CardTitle>
            <CardDescription>Behavioral patterns and metadata used for bot detection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <p className="font-medium text-sm">Account Metrics</p>
                  <p className="text-xs text-muted-foreground">Karma, age, verification status</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2" />
                <div>
                  <p className="font-medium text-sm">Activity Patterns</p>
                  <p className="text-xs text-muted-foreground">Comment frequency, timing patterns</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-chart-3 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-sm">Content Analysis</p>
                  <p className="text-xs text-muted-foreground">Comment length, diversity metrics</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-chart-4 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-sm">Engagement</p>
                  <p className="text-xs text-muted-foreground">Subreddit diversity, interaction rates</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-chart-5 rounded-full mt-2" />
                <div>
                  <p className="font-medium text-sm">Username Patterns</p>
                  <p className="text-xs text-muted-foreground">Length, numeric indicators</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                <div>
                  <p className="font-medium text-sm">Temporal Features</p>
                  <p className="text-xs text-muted-foreground">Activity consistency, time gaps</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default KeyFeaturesAnalyzed;