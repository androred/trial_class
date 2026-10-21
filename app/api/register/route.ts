import { NextResponse } from 'next/server';

const phonePattern = /^(?:\+?62|0)8\d{7,11}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try { data = await request.json(); } catch { return NextResponse.json({ error: 'Data pendaftaran tidak valid.' }, { status: 400 }); }
  for (const key of ['name', 'phone', 'email', 'status', 'itBackground', 'goal', 'course', 'slot']) {
    if (typeof data[key] !== 'string' || !String(data[key]).trim()) return NextResponse.json({ error: 'Lengkapi semua data wajib terlebih dahulu.' }, { status: 400 });
  }
  if (!phonePattern.test(String(data.phone).replace(/[\s-]/g, ''))) return NextResponse.json({ error: 'Format nomor WhatsApp Indonesia belum sesuai.' }, { status: 400 });
  if (!emailPattern.test(String(data.email))) return NextResponse.json({ error: 'Format email belum sesuai.' }, { status: 400 });
  if (data.consent !== 'on' && data.consent !== true) return NextResponse.json({ error: 'Persetujuan kebijakan privasi diperlukan.' }, { status: 400 });
  // Google Sheets and Calendar credentials will be wired here through server-side environment variables.
  // Never report a registration as successful until the durable store and calendar invite are available.
  return NextResponse.json({ error: 'Pendaftaran online belum diaktifkan. Silakan hubungi tim Haltev melalui WhatsApp untuk mengamankan kursi.' }, { status: 503 });
}
