import { NextRequest, NextResponse } from 'next/server';
import { createServiceSupabaseClient } from '@/lib/config/supabase-server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId, email, full_name, avatar_url } = body;

  if (!userId || !email) {
    return NextResponse.json(
      { error: 'Missing userId or email' },
      { status: 400 },
    );
  }

  const supabase = createServiceSupabaseClient();
  const { error } = await supabase.from('profiles').upsert(
    {
      id: userId,
      email,
      full_name,
      avatar_url,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
