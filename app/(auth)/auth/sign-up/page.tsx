import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignUpForm } from '@/components/auth/sign-up-form';

export default function SignUpPage() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Start your athlete identity journey with Griit.
          </CardDescription>
        </CardHeader>
        <SignUpForm />
        <p className="text-muted-foreground mt-6 text-sm">
          Already have an account?{' '}
          <Link href="/auth/sign-in" className="text-primary font-medium">
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
}
