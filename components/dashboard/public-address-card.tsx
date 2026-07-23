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
    <section className="overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_18px_50px_rgba(21,21,21,0.05)]">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef2ff] text-[#3157ff]">
            <Globe2 className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold tracking-[-0.01em]">Public profile</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-[#f7f6f1] px-2 py-0.5 text-[10px] font-black tracking-wider uppercase">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                {isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="mt-2 truncate text-lg font-black tracking-[-0.03em] sm:text-xl">
              {displayUrl}
            </p>
            <p className="mt-1 text-xs text-black/50">
              {isPublished
                ? 'Ready to share anywhere.'
                : 'Publish your profile when you are ready to share it.'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            aria-live="polite"
            className="flex-1 rounded-full border-black/10 bg-white hover:bg-[#f7f6f1] sm:flex-none"
            type="button"
            variant="outline"
            size="sm"
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
            <Button
              asChild
              className="flex-1 rounded-full bg-[#151515] text-white hover:bg-[#3157ff] sm:flex-none"
              size="sm"
            >
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
