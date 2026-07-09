import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set a new password</CardTitle>
          <CardDescription>
            Complete the password reset by choosing a secure new password.
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          <ResetPasswordForm />
        </div>
      </Card>
    </main>
  );
}
