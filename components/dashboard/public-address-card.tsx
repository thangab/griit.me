'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowSquareOutIcon as ArrowUpRight,
  CheckIcon as Check,
  CircleNotchIcon as CircleNotch,
  CopyIcon as Copy,
  EyeSlashIcon as EyeSlash,
  GlobeIcon as Globe2,
  UploadSimpleIcon as Publish,
} from '@phosphor-icons/react/ssr';
import { Button } from '@/components/ui/button';
import { useUiCopy } from '@/components/i18n/use-ui-copy';
import { setProfilePublishedAction } from '@/lib/actions/profile-builder';

export function PublicAddressCard({
  profileId,
  username,
  isPublished,
}: {
  profileId: number;
  username: string;
  isPublished: boolean;
}) {
  const ui = useUiCopy();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [visibilityMessage, setVisibilityMessage] = useState('');
  const [visibilityPending, startVisibilityTransition] = useTransition();
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

  const updatePublishedState = () => {
    const nextIsPublished = !isPublished;
    if (
      !nextIsPublished &&
      !window.confirm(
        ui(
          'Move your profile back to draft? It will no longer be publicly accessible.',
        ),
      )
    ) {
      return;
    }

    setVisibilityMessage('');
    startVisibilityTransition(async () => {
      const result = await setProfilePublishedAction(
        profileId,
        nextIsPublished,
      );
      if (!result.success) {
        setVisibilityMessage(result.message);
        return;
      }

      router.refresh();
    });
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
              <h2 className="font-bold tracking-[-0.01em]">
                {ui('Public profile')}
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-[#f7f6f1] px-2 py-0.5 text-[10px] font-black tracking-wider uppercase">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isPublished ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                {isPublished ? ui('Published') : ui('Draft')}
              </span>
            </div>
            <p className="mt-2 truncate text-lg font-black tracking-[-0.03em] sm:text-xl">
              {displayUrl}
            </p>
            <p className="mt-1 text-xs text-black/50">
              {isPublished
                ? ui('Ready to share anywhere.')
                : ui('Publish your profile when you are ready to share it.')}
            </p>
            {visibilityMessage ? (
              <p className="mt-2 text-xs font-semibold text-red-700">
                {visibilityMessage}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {!isPublished ? (
            <Button
              className="flex-1 rounded-full bg-[#151515] text-white hover:bg-[#3157ff] sm:flex-none"
              disabled={visibilityPending}
              size="sm"
              type="button"
              onClick={updatePublishedState}
            >
              {visibilityPending ? (
                <CircleNotch className="h-4 w-4 animate-spin" />
              ) : (
                <Publish className="h-4 w-4" />
              )}
              {visibilityPending ? ui('Publishing…') : ui('Publish profile')}
            </Button>
          ) : null}
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
            {copied ? ui('Copied') : ui('Copy URL')}
          </Button>
          {isPublished ? (
            <>
              <Button
                asChild
                className="flex-1 rounded-full bg-[#151515] text-white hover:bg-[#3157ff] sm:flex-none"
                size="sm"
              >
                <a href={`/${username}`} rel="noreferrer" target="_blank">
                  {ui('Open')}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                className="flex-1 rounded-full sm:flex-none"
                disabled={visibilityPending}
                size="sm"
                type="button"
                variant="ghost"
                onClick={updatePublishedState}
              >
                {visibilityPending ? (
                  <CircleNotch className="h-4 w-4 animate-spin" />
                ) : (
                  <EyeSlash className="h-4 w-4" />
                )}
                {visibilityPending
                  ? ui('Updating visibility…')
                  : ui('Move to draft')}
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
