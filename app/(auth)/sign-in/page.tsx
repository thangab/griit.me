import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignInForm } from '@/components/auth/sign-in-form';

export default function SignInPage() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Access your Griit dashboard and start building your profile.
          </CardDescription>
        </CardHeader>
        <SignInForm />
        <p className="text-muted-foreground mt-6 text-sm">
          New here?{' '}
          <Link href="/sign-up" className="text-primary font-medium">
            Create an account
          </Link>
        </p>
      </Card>
    </main>
  );
}
