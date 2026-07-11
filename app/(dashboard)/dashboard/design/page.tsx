import { Button } from '@/components/ui/button';
// import { getSubscriptionState } from '@/lib/services/billing';
import { DesignEditor } from '@/components/dashboard/design-editor';
import { DesignPreview } from '@/components/dashboard/design-preview';
import { getProfileBuilderState } from '@/lib/services/profile-builder';

const pageSections = [
  { label: 'Header', subtitle: 'Cover and intro' },
  { label: 'Socials', subtitle: 'Link your profiles' },
  { label: 'Blocks', subtitle: 'Content cards and links' },
];

const styleSections = [
  'Templates',
  'General Styles',
  'Block Styles',
  'Fonts',
  'Colors',
  'Social & Sharing',
  'All Styles',
  'Media Gallery',
];

export default async function DesignPage() {
  // const subscription = await getSubscriptionState();
  const builder = await getProfileBuilderState();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[280px_1fr_280px]">
        <aside className="border-border bg-background/80 space-y-4 rounded-3xl border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
                Page
              </p>
              <p className="mt-2 font-semibold">
                {builder.pages.find((page) => page.isHome)?.title ?? 'Home'}
              </p>
            </div>
            <Button size="sm" variant="outline">
              Add page
            </Button>
          </div>

          <div className="border-border bg-card space-y-3 rounded-3xl border p-4">
            {pageSections.map((section) => (
              <div
                key={section.label}
                className="border-border bg-background rounded-2xl border p-4"
              >
                <p className="text-sm font-semibold">{section.label}</p>
                <p className="text-muted-foreground text-sm">
                  {section.subtitle}
                </p>
              </div>
            ))}
          </div>

          <div className="border-border bg-card rounded-3xl border p-4">
            <p className="text-sm font-semibold">Sections</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Drag blocks to reorder the mobile feed and keep your page timeline
              fresh.
            </p>
          </div>
        </aside>

        <section className="space-y-4">
          <DesignPreview builder={builder} />
        </section>

        <aside className="border-border bg-background/80 space-y-5 rounded-3xl border p-5">
          <DesignEditor builder={builder} />

          <div className="border-border border-t pt-4">
            <p className="text-muted-foreground text-xs tracking-[0.24em] uppercase">
              Style panels
            </p>
          </div>

          <div className="space-y-2">
            {styleSections.map((section) => (
              <button
                key={section}
                className="border-border bg-card hover:border-primary/40 flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition"
                type="button"
              >
                <span className="font-medium">{section}</span>
                <span className="text-muted-foreground">›</span>
              </button>
            ))}
          </div>

          <div className="border-border bg-card rounded-3xl border p-4">
            <p className="text-sm font-semibold">Need more?</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Pro unlocks more page styles, fonts, and advanced sharing options.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
