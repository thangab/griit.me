import { CheckCircleIcon, WarningCircleIcon } from '@phosphor-icons/react/ssr';

export function AuthFormMessage({
  message,
  title,
  type,
}: {
  message: string;
  title: string;
  type: 'error' | 'success';
}) {
  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircleIcon : WarningCircleIcon;

  return (
    <div
      aria-live="polite"
      className={`flex items-start gap-3 rounded-xl border px-4 py-3.5 ${
        isSuccess
          ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
          : 'border-red-200 bg-red-50 text-red-900'
      }`}
      role={isSuccess ? 'status' : 'alert'}
    >
      <Icon
        className={`mt-0.5 h-5 w-5 shrink-0 ${
          isSuccess ? 'text-emerald-600' : 'text-red-600'
        }`}
        weight="fill"
      />
      <div className="min-w-0">
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-0.5 text-sm leading-5 opacity-75">{message}</p>
      </div>
    </div>
  );
}
