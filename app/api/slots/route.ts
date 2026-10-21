import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const courseIds: Record<string, string> = {
  DM: 'digital-marketing',
  DS: 'data-science',
  Web: 'web-development',
  'Mobile Apps': 'mobile-development',
};

export async function GET() {
  const endpoint = process.env.APPS_SCRIPT_URL;
  const token = process.env.APPS_SCRIPT_TOKEN;
  if (!endpoint || !token) return NextResponse.json({ error: 'Jadwal belum dikonfigurasi.' }, { status: 503 });

  try {
    const url = new URL(endpoint);
    url.searchParams.set('action', 'slots');
    url.searchParams.set('token', token);
    const upstream = await fetch(url, { cache: 'no-store', redirect: 'follow' });
    const result = await upstream.json();
    if (!upstream.ok || !result.ok || !Array.isArray(result.slots)) {
      return NextResponse.json({ error: result.error || 'Jadwal belum dapat dimuat.' }, { status: 502 });
    }
    const slots = result.slots.map((slot: Record<string, unknown>) => ({
      ...slot,
      course: courseIds[String(slot.course)] || String(slot.course),
    }));
    return NextResponse.json({ slots });
  } catch {
    return NextResponse.json({ error: 'Layanan jadwal sedang tidak dapat dihubungi.' }, { status: 502 });
  }
}
