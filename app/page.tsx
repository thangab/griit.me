import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-6">
      <div className="border-border bg-card w-full max-w-xl rounded-2xl border p-10 shadow-sm">
        <p className="text-muted-foreground text-sm font-medium tracking-[0.2em] uppercase">
          Griit
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          Build your athlete identity.
        </h1>
        <p className="text-muted-foreground mt-4 text-lg">
          A premium foundation for athlete profiles, milestones, and digital
          presence.
        </p>
        <div className="mt-8 flex gap-3">
          <Link
            href="/sign-in"
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="border-border rounded-lg border px-4 py-2 text-sm font-medium"
          >
            View dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
