'use client';

import { useRef, useState } from 'react';
import { ImageIcon, Loader2, Trash2, Upload } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/config/supabase-client';
import { cn } from '@/lib/utils/cn';

const profileMediaBucket = 'profile-media';
const maxImageSize = 5 * 1024 * 1024;
const allowedImageTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
  ['image/avif', 'avif'],
]);

type ImageUploadFieldProps = {
  name: string;
  label: string;
  value: string;
  folder: 'avatars' | 'covers' | 'gallery' | 'sponsors' | 'offers' | 'links';
  helpText?: string;
  previewShape?: 'square' | 'wide' | 'logo';
  onValueChange?: (url: string) => void;
};

export function ImageUploadField({
  name,
  label,
  value,
  folder,
  helpText,
  previewShape = 'wide',
  onValueChange,
}: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentValue, setCurrentValue] = useState(value);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState('');

  const updateValue = (url: string) => {
    setCurrentValue(url);
    setStatus('idle');
    setMessage('');
    onValueChange?.(url);
  };

  const uploadFile = async (file: File | undefined) => {
    if (!file) return;

    const extension = allowedImageTypes.get(file.type);

    if (!extension) {
      setStatus('error');
      setMessage('Use a JPG, PNG, WebP, GIF, or AVIF image.');
      return;
    }

    if (file.size > maxImageSize) {
      setStatus('error');
      setMessage('Image must be smaller than 5 MB.');
      return;
    }

    setStatus('uploading');
    setMessage('');

    const supabase = createBrowserSupabaseClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      setStatus('error');
      setMessage('You need to be signed in to upload an image.');
      return;
    }

    const path = `${userData.user.id}/${folder}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from(profileMediaBucket)
      .upload(path, file, {
        cacheControl: '31536000',
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      setStatus('error');
      setMessage(uploadError.message || 'Unable to upload this image.');
      return;
    }

    const { data } = supabase.storage
      .from(profileMediaBucket)
      .getPublicUrl(path);

    updateValue(data.publicUrl);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    await uploadFile(event.target.files?.[0]);
    event.target.value = '';
  };

  return (
    <div className="space-y-2">
      <input name={name} type="hidden" value={currentValue} />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium">{label}</p>
        {currentValue ? (
          <button
            className="text-muted-foreground hover:text-destructive inline-flex items-center gap-1 text-xs font-medium transition-colors"
            disabled={status === 'uploading'}
            type="button"
            onClick={() => updateValue('')}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        ) : null}
      </div>

      <input
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="sr-only"
        type="file"
        onChange={handleFileChange}
      />
      <button
        className={cn(
          'border-border bg-background hover:border-primary/50 hover:bg-muted/30 flex min-h-28 w-full cursor-pointer items-center gap-4 rounded-xl border border-dashed p-3 text-left transition-colors',
          isDragging && 'border-primary bg-primary/5',
          status === 'uploading' && 'pointer-events-none opacity-60',
        )}
        data-autofocus-field
        disabled={status === 'uploading'}
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setIsDragging(false);
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy';
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void uploadFile(event.dataTransfer.files?.[0]);
        }}
      >
        <span
          className={cn(
            'bg-muted relative flex h-20 shrink-0 items-center justify-center overflow-hidden border bg-cover bg-center',
            previewShape === 'square' && 'w-20 rounded-full',
            previewShape === 'wide' && 'w-28 rounded-lg',
            previewShape === 'logo' &&
              'w-28 rounded-lg bg-contain bg-no-repeat',
          )}
          style={
            currentValue
              ? { backgroundImage: `url(${JSON.stringify(currentValue)})` }
              : undefined
          }
        >
          {!currentValue ? (
            <ImageIcon className="text-muted-foreground h-5 w-5" />
          ) : null}
          {status === 'uploading' ? (
            <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white">
              <Loader2 className="h-5 w-5 animate-spin" />
            </span>
          ) : null}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 text-sm font-semibold">
            {status === 'uploading' ? (
              'Uploading…'
            ) : (
              <>
                <Upload className="h-4 w-4 shrink-0" />
                {currentValue ? 'Replace image' : 'Choose an image'}
              </>
            )}
          </span>
          <span className="text-muted-foreground mt-1 block text-xs leading-5">
            {isDragging
              ? 'Drop the image here'
              : 'Click or drag and drop · 5 MB max'}
          </span>
          <span className="text-muted-foreground/70 mt-0.5 block text-[11px]">
            JPG, PNG, WebP, GIF or AVIF
          </span>
        </span>
      </button>

      {helpText ? (
        <p className="text-muted-foreground text-xs leading-5">{helpText}</p>
      ) : null}
      {message ? (
        <p className="text-destructive text-xs leading-5" role="alert">
          {message}
        </p>
      ) : null}
    </div>
  );
}
