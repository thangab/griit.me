import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { getRequestLocale } from '@/lib/i18n/server';

export default async function ResetPasswordPage() {
  const isFrench = (await getRequestLocale()) === 'fr';
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {isFrench
              ? 'Définissez un nouveau mot de passe'
              : 'Set a new password'}
          </CardTitle>
          <CardDescription>
            {isFrench
              ? 'Terminez la réinitialisation en choisissant un nouveau mot de passe sécurisé.'
              : 'Complete the password reset by choosing a secure new password.'}
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          <ResetPasswordForm />
        </div>
      </Card>
    </main>
  );
}
