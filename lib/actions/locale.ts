'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { isLocale, localeCookieName, type Locale } from '@/lib/i18n/config';
import {
  createServerSupabaseClient,
  createServiceSupabaseClient,
} from '@/lib/config/supabase-server';

export async function setLocaleAction(formData: FormData) {
  const requestedLocale = formData.get('locale');
  if (!isLocale(requestedLocale)) return;

  const locale: Locale = requestedLocale;
  (await cookies()).set(localeCookieName, locale, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const serviceSupabase = createServiceSupabaseClient();
    const { error } = await serviceSupabase
      .from('profiles')
      .update({
        preferred_locale: locale,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) console.error('Unable to save preferred locale:', error.message);
  }

  revalidatePath('/', 'layout');
}
