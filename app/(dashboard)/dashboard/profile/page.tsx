import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Personal details and athlete identity settings will live here.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
