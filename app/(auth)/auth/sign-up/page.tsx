import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Start your athlete identity journey with Griit.</CardDescription>
        </CardHeader>
        <div className="space-y-3">
          <Button className="w-full">Create account</Button>
          <Button variant="outline" className="w-full">
            Continue with Google
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="font-medium text-primary">
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
