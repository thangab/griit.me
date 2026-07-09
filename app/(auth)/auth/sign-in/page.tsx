import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignInForm } from '@/components/auth/sign-in-form';

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Access your Griit dashboard and start building your profile.</CardDescription>
        </CardHeader>
        <SignInForm />
        <p className="mt-6 text-sm text-muted-foreground">
          New here?{' '}
          <Link href="/auth/sign-up" className="font-medium text-primary">
            Create an account
          </Link>
        </p>
      </Card>
    </main>
  );
}
