'use client';

import { useState } from 'react';
import {
  ArrowSquareOutIcon as ArrowUpRight,
  CheckIcon as Check,
  CopyIcon as Copy,
  GlobeIcon as Globe2,
} from '@phosphor-icons/react/ssr';
import { Button } from '@/components/ui/button';

export function PublicAddressCard({
  username,
  isPublished,
}: {
  username: string;
  isPublished: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const displayUrl = `griit.me/${username}`;
  const publicUrl = `https://${displayUrl}`;

  const copyPublicUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="border-border bg-card overflow-hidden rounded-xl border shadow-sm">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <span className="bg-muted text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <Globe2 className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-semibold">Current public address</h2>
              <span className="border-border bg-background inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                {isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="mt-2 truncate text-lg font-semibold sm:text-xl">
              {displayUrl}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              {isPublished
                ? 'Ready to share anywhere.'
                : 'Publish your profile when you are ready to share it.'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            aria-live="polite"
            className="flex-1 sm:flex-none"
            type="button"
            variant="outline"
            onClick={() => void copyPublicUrl()}
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? 'Copied' : 'Copy URL'}
          </Button>
          {isPublished ? (
            <Button asChild className="flex-1 sm:flex-none" variant="outline">
              <a href={`/${username}`} rel="noreferrer" target="_blank">
                Open
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
