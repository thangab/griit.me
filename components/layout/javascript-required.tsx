type JavaScriptRequiredProps = {
  children: React.ReactNode;
  id: string;
  className?: string;
  title?: string;
  description?: string;
};

export function JavaScriptRequired({
  children,
  id,
  className,
  title = 'JavaScript is required',
  description = 'Enable JavaScript in your browser, then reload this page to use GRIIT Studio.',
}: JavaScriptRequiredProps) {
  return (
    <>
      <div className={className} id={id}>
        {children}
      </div>
      <noscript>
        <style>{`#${id} { display: none !important; }`}</style>
        <main className="bg-background text-foreground fixed inset-0 z-[9999] flex min-h-dvh items-center justify-center p-6">
          <section className="border-border bg-card w-full max-w-md rounded-2xl border p-7 text-center shadow-sm sm:p-9">
            <span
              aria-hidden="true"
              className="bg-foreground text-background mx-auto flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold"
            >
              G.
            </span>
            <p className="mt-6 text-xl font-semibold">{title}</p>
            <p className="text-muted-foreground mt-3 text-sm leading-6">
              {description}
            </p>
          </section>
        </main>
      </noscript>
    </>
  );
}
