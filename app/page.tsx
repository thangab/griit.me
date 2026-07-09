import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-10 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Griit</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Build your athlete identity.</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A premium foundation for athlete profiles, milestones, and digital presence.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/auth/sign-in" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Sign in
          </Link>
          <Link href="/dashboard" className="rounded-lg border border-border px-4 py-2 text-sm font-medium">
            View dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
