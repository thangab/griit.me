'use client';

import type { BillingInterval } from '@/lib/types/billing';

export function BillingIntervalToggle({
  value,
  onChange,
  compact = false,
}: {
  value: BillingInterval;
  onChange: (value: BillingInterval) => void;
  compact?: boolean;
}) {
  return (
    <div
      aria-label="Billing frequency"
      className={`grid w-full grid-cols-2 rounded-full border border-black/10 bg-white p-1.5 shadow-[0_12px_35px_rgba(21,21,21,0.09)] ${compact ? 'max-w-[360px] text-xs' : 'max-w-[620px] text-sm sm:text-base'}`}
      role="group"
    >
      <button
        aria-pressed={value === 'month'}
        className={`rounded-full font-bold transition-all ${compact ? 'min-h-10 px-3 py-2' : 'min-h-12 px-4 py-2.5'} ${value === 'month' ? 'bg-[#151515] text-white shadow-sm' : 'text-black/55 hover:bg-black/[0.04] hover:text-black'}`}
        onClick={() => onChange('month')}
        type="button"
      >
        Monthly
      </button>
      <button
        aria-pressed={value === 'year'}
        className={`flex items-center justify-center gap-2 rounded-full font-bold transition-all ${compact ? 'min-h-10 px-2 py-2' : 'min-h-12 px-3 py-2.5 sm:px-4'} ${value === 'year' ? 'bg-[#151515] text-white shadow-sm' : 'text-black/55 hover:bg-black/[0.04] hover:text-black'}`}
        onClick={() => onChange('year')}
        type="button"
      >
        <span>Annual</span>
        <span
          className={`rounded-full px-2 py-1 text-[9px] leading-none font-black whitespace-nowrap uppercase sm:text-[10px] ${value === 'year' ? 'bg-[#a9ed35] text-[#151515]' : 'bg-[#dff5b4] text-[#151515]'}`}
        >
          Save 20%
        </span>
      </button>
    </div>
  );
}
