import { NextResponse } from 'next/server';

const phonePattern = /^(?:\+?62|0)8\d{7,11}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try { data = await request.json(); } catch { return NextResponse.json({ error: 'Data pendaftaran tidak valid.' }, { status: 400 }); }
  for (const key of ['name', 'phone', 'email', 'status', 'itBackground', 'goal', 'course', 'slot', 'attendanceMode']) {
    if (typeof data[key] !== 'string' || !String(data[key]).trim()) return NextResponse.json({ error: 'Lengkapi semua data wajib terlebih dahulu.' }, { status: 400 });
  }
  if (!phonePattern.test(String(data.phone).replace(/[\s-]/g, ''))) return NextResponse.json({ error: 'Format nomor WhatsApp Indonesia belum sesuai.' }, { status: 400 });
  if (!emailPattern.test(String(data.email))) return NextResponse.json({ error: 'Format email belum sesuai.' }, { status: 400 });
  if (!['Online', 'Offline'].includes(String(data.attendanceMode))) return NextResponse.json({ error: 'Pilih mode kehadiran online atau offline.' }, { status: 400 });
  if (data.consent !== 'on' && data.consent !== true) return NextResponse.json({ error: 'Persetujuan kebijakan privasi diperlukan.' }, { status: 400 });

  const endpoint = process.env.APPS_SCRIPT_URL;
  const token = process.env.APPS_SCRIPT_TOKEN;
  if (!endpoint || !token) return NextResponse.json({ error: 'Pendaftaran online belum dikonfigurasi.' }, { status: 503 });

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, token }),
      cache: 'no-store',
      redirect: 'follow',
    });
    const result = await upstream.json();
    if (!upstream.ok || !result.ok) {
      return NextResponse.json({ error: result.error || 'Pendaftaran belum berhasil. Silakan coba lagi.' }, { status: 502 });
    }
    return NextResponse.json({ ok: true, registrationId: result.registrationId, eventId: result.eventId, meetLink: result.meetLink || '' });
  } catch {
    return NextResponse.json({ error: 'Layanan pendaftaran sedang tidak dapat dihubungi. Coba lagi beberapa saat.' }, { status: 502 });
  }
}
