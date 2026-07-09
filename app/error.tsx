'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">Oops</p>
        <h2 className="mt-3 text-2xl font-semibold">Something went wrong.</h2>
        <p className="mt-2 text-sm text-muted-foreground">A problem occurred while loading this page.</p>
        <button onClick={() => reset()} className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Try again
        </button>
      </div>
    </div>
  );
}
