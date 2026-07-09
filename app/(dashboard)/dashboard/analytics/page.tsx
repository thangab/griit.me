import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>Profile traffic and engagement insights will be surfaced here.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
