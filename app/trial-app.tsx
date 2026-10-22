'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

const courses = [
  { id: 'data-science', name: 'Data Science', icon: '◉', tagline: 'Ubah data jadi insight yang bermakna.', material: 'Jalankan kode Python pertama dan buat grafik dari dataset kecil dengan bantuan AI.', fit: 'Untuk kamu yang tertarik menjadi data analyst atau data scientist.', tutor: 'Tutor Haltev' },
  { id: 'digital-marketing', name: 'Digital Marketing', icon: '↗', tagline: 'Bikin ide jadi kampanye digital.', material: 'Buat satu konten atau iklan dengan AI, lalu baca metrik dasarnya.', fit: 'Untuk pemilik bisnis, marketer, dan career switcher.', tutor: 'Tutor Haltev' },
  { id: 'web-development', name: 'Web Development', icon: '⌘', tagline: 'Bangun halaman web pertamamu.', material: 'Buat satu halaman web sederhana dengan bantuan AI.', fit: 'Untuk pemula yang ingin jadi web developer.', tutor: 'Tutor Haltev' },
  { id: 'mobile-development', name: 'Mobile Development', icon: '▣', tagline: 'Kenali cara aplikasi Android dibuat.', material: 'Jalankan aplikasi Android sederhana di emulator atau HP.', fit: 'Untuk pemula yang ingin jadi mobile developer.', tutor: 'Tutor Haltev' },
];

type TrialSlot = { id: string; course: string; date: string; time: string; endTime: string; tutor: string; seats: number; mode: string };

const salesPeople = [
  { code: 'rusyati', name: 'Rusyati Fitriyani Rustam' },
  { code: 'alfindo', name: 'Alfindo Putra Setyawan' },
];

const dateLabel = (value: string) => new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Jakarta' }).format(new Date(`${value}T12:00:00+07:00`));

export default function TrialApp() {
  const [sales, setSales] = useState('');
  const [salesCode, setSalesCode] = useState('');
  const [attendanceMode, setAttendanceMode] = useState('');
  const [course, setCourse] = useState('');
  const [slot, setSlot] = useState('');
  const [slots, setSlots] = useState<TrialSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const selectedCourse = courses.find((item) => item.id === course);
  const selectedSlot = slots.find((item) => item.id === slot);
  const availableSlots = useMemo(() => slots.filter((item) => item.course === course && item.seats > 0), [course, slots]);

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;
    let firstLoad = true;
    const loadSlots = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const response = await fetch('/api/slots', { cache: 'no-store' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Jadwal belum dapat dimuat.');
        if (!cancelled) {
          setSlots(result.slots || []);
          setSlotsError('');
        }
      } catch (error) {
        if (!cancelled && firstLoad) setSlotsError(error instanceof Error ? error.message : 'Jadwal belum dapat dimuat.');
      } finally {
        inFlight = false;
        if (firstLoad) {
          firstLoad = false;
          if (!cancelled) setSlotsLoading(false);
        }
      }
    };
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') void loadSlots();
    };
    void loadSlots();
    window.addEventListener('focus', refreshWhenVisible);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    const refreshTimer = window.setInterval(refreshWhenVisible, 60_000);
    const code = new URLSearchParams(window.location.search).get('sales')?.toLowerCase() || '';
    setSalesCode(code);
    setSales(salesPeople.find((person) => person.code === code)?.name || '');
    return () => {
      cancelled = true;
      window.clearInterval(refreshTimer);
      window.removeEventListener('focus', refreshWhenVisible);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setLoading(true);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, course, slot }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Pendaftaran belum berhasil. Coba lagi.');
      setSlots((current) => current.map((item) => item.id === String(slot) ? { ...item, seats: Math.max(0, item.seats - 1) } : item));
      setAttendanceMode(String(payload.attendanceMode || ''));
      setDone(true);
    } catch (e) { setError(e instanceof Error ? e.message : 'Terjadi kendala. Coba lagi.'); }
    finally { setLoading(false); }
  }

  return <main>
    <header className="topbar"><a className="brand" href="https://haltev.id" aria-label="Haltev"><img className="brand-logo" src="/logo-haltev.png" alt="" /><span>haltev<span className="brand-dot">.</span></span></a><a className="help-link" href={`https://wa.me/6287800092728?text=${encodeURIComponent('Halo, saya ingin bertanya tentang Trial Class Haltev.')}`} target="_blank" rel="noreferrer">Butuh bantuan? <b>Chat kami ↗</b></a></header>
    <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="live-dot"/> TRIAL CLASS HALTEV</div><h1>Belajar dulu.<br/><em>Yakin kemudian.</em></h1><p>Coba kelas pilihanmu gratis selama 1 jam. Kenalan dengan materi, tutor, dan cara belajarnya sebelum menentukan langkah berikutnya.</p><div className="hero-points"><span>✳ Gratis, tanpa komitmen</span><span>◷ Durasi ±1 jam</span><span>♧ Maks. 5 peserta</span></div></div><div className="hero-art" aria-hidden="true"><div className="sun"/><div className="orb orb-one"/><div className="orb orb-two"/><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="art-card"><span className="art-spark">✳</span><div className="art-line short"/><div className="art-line"/><div className="art-bars"><i/><i/><i/><i/><i/></div><span className="art-label">YOUR NEXT CHAPTER</span></div><span className="art-note note-left">new skills<br/>new possibilities</span><span className="art-note note-right">01 — 04</span></div></section>
    <div className="content">
      {!done ? <>
        <div className="section-heading"><div><div className="step-label">01 <span>— PILIH KELAS</span></div><h2>Mulai dari yang bikin penasaran.</h2><p>Pilih satu kelas untuk pengalaman trial-mu.</p></div><div className="step-count"><span>LANGKAH</span><b>01 <i>/</i> 03</b></div></div>
        <div className="course-grid">{courses.map((item, index) => <button className={`course-card ${course === item.id ? 'selected' : ''}`} key={item.id} onClick={() => { setCourse(item.id); setSlot(''); }}><span className="card-top"><span className="course-icon">{item.icon}</span><span className="card-number">0{index + 1}</span></span><h3>{item.name}</h3><p className="tagline">{item.tagline}</p><div className="card-detail"><b>DI SESI TRIAL</b><p>{item.material}</p></div><span className="card-footer"><span>{item.tutor}</span><span className="choose-circle">{course === item.id ? '✓' : '↗'}</span></span></button>)}</div>
        <div className="info-strip"><span className="info-icon">i</span><p><b>Gak perlu punya basic IT.</b> Cukup bawa rasa ingin tahu dan laptopmu.</p><span className="strip-divider"/><span className="strip-small">Pilihan online & offline di Bekasi</span></div>
        {course && <section className="booking" id="booking"><div className="booking-heading"><div><div className="step-label">02 <span>— PILIH JADWAL</span></div><h2>Temukan waktu yang pas.</h2><p>Semua waktu dalam WIB · Pendaftaran tutup 3 jam sebelum kelas.</p></div><div className="step-count"><span>LANGKAH</span><b>02 <i>/</i> 03</b></div></div>{slotsLoading ? <p className="slot-note">Memuat jadwal…</p> : slotsError ? <p className="error" role="alert">{slotsError}</p> : availableSlots.length ? <div className="slot-list">{availableSlots.map((item) => <button className={`slot-card ${slot === item.id ? 'slot-selected' : ''}`} key={item.id} onClick={() => { setSlot(item.id); setAttendanceMode(''); }}><span className="slot-date">{dateLabel(item.date)}</span><strong>{item.time}</strong><span className="slot-mode"><i className="online"/>Online atau Offline · pilih saat mendaftar</span><span className="slot-tutor">{item.tutor}</span><span className="slot-seats">{item.seats} kursi tersedia</span><span className="radio-dot"/></button>)}<div className="slot-note">Jadwal lain belum tersedia? <a href="https://wa.me/6287800092728">Hubungi tim kami ↗</a></div></div> : <p className="slot-note">Belum ada jadwal tersedia untuk kelas ini. Silakan hubungi tim kami melalui <a href="https://wa.me/6287800092728">WhatsApp ↗</a>.</p>}</section>}
        {course && slot && <section className="form-section"><div className="booking-heading"><div><div className="step-label">03 <span>— DATA DIRI</span></div><h2>Satu langkah kecil lagi.</h2><p>Isi data ini agar tutor bisa menyiapkan sesi yang relevan.</p></div><div className="step-count"><span>LANGKAH</span><b>03 <i>/</i> 03</b></div></div><form onSubmit={submit}><div className="form-grid"><label>Nama lengkap<input name="name" required placeholder="Nama yang biasa dipakai" autoComplete="name"/></label><label>Nomor WhatsApp<input name="phone" type="tel" required placeholder="08xxxxxxxxxx" autoComplete="tel"/></label><label className="full">Email untuk undangan kalender<input name="email" type="email" required placeholder="nama@email.com" autoComplete="email"/></label><label>Mode kehadiran<select name="attendanceMode" required value={attendanceMode} onChange={(event) => setAttendanceMode(event.target.value)}><option value="" disabled>Pilih online atau offline</option><option value="Online">Online · Google Meet</option><option value="Offline">Offline · Grand Galaxy City</option></select></label><label>Status saat ini<select name="status" required defaultValue=""><option value="" disabled>Pilih status</option><option>Pelajar / Mahasiswa</option><option>Fresh graduate</option><option>Karyawan</option><option>Wirausaha</option><option>Lainnya</option></select></label><label>Punya latar belakang IT?<select name="itBackground" required defaultValue=""><option value="" disabled>Pilih jawaban</option><option>Ya</option><option>Tidak</option></select></label><label>Tujuan belajar<select name="goal" required defaultValue=""><option value="" disabled>Pilih tujuan</option><option>Cari kerja</option><option>Pindah karier</option><option>Upskill</option><option>Mengembangkan bisnis</option></select></label><label>Nama sales<select name="sales" value={sales} onChange={(event) => { const person = salesPeople.find((entry) => entry.name === event.target.value); setSales(event.target.value); setSalesCode(person?.code || ''); }}><option value="">Pilih nama sales (opsional)</option>{salesPeople.map((person) => <option key={person.code} value={person.name}>{person.name}</option>)}</select><input type="hidden" name="salesCode" value={salesCode}/></label><label className="full">Apa yang masih bikin kamu ragu ikut kelas penuh? <span className="optional">OPSIONAL</span><textarea name="hesitation" rows={3} placeholder="Ceritakan sedikit (opsional)"/></label></div><label className="consent"><input type="checkbox" name="consent" required/><span>Saya menyetujui <a href="/privacy" target="_blank">kebijakan privasi</a> dan penggunaan data saya untuk keperluan trial class serta tindak lanjut dari Haltev.</span></label><div className="form-bottom"><p>Dengan mendaftar, kamu tidak dikenakan biaya apa pun.</p><button className="submit-button" type="submit" disabled={loading}>{loading ? 'Mengirim…' : 'Amankan kursiku'} <span>↗</span></button></div>{error && <p role="alert" className="error">{error}</p>}</form></section>}
      </> : <section className="success"><div className="success-check">✓</div><div className="eyebrow">PENDAFTARAN BERHASIL</div><h2>Kursimu sudah diamankan.</h2><p>Undangan kalender untuk <b>{selectedCourse?.name}</b> pada <b>{selectedSlot ? `${dateLabel(selectedSlot.date)}, pukul ${selectedSlot.time} WIB` : ''}</b> akan dikirim ke emailmu.</p><div className="success-details"><span>👋 Tutor</span><b>{selectedSlot?.tutor}</b><span>⌖ Lokasi</span><b>{attendanceMode === 'Online' ? 'Link Google Meet ada di undangan kalender' : 'Grand Galaxy City, Bekasi Selatan'}</b></div><p className="success-small">Cek inbox dan folder spam emailmu untuk undangan kalender. Sampai jumpa di kelas!</p><button className="text-button" onClick={() => { setDone(false); setCourse(''); setSlot(''); setAttendanceMode(''); }}>← Lihat kelas lainnya</button></section>}
      <div className="trust-row"><span>✳ KELAS KECIL, BELAJAR LEBIH PERSONAL</span><span>KURIKULUM BERBASIS AI</span><span>LANGKAH NYATA MENUJU KARIER DIGITAL</span></div>
      <div className="location"><div><span className="step-label">SESI OFFLINE</span><h3>Belajar bareng, di Grand Galaxy City.</h3><p>Jl. Boulevard Raya Barat Blok RGA No. 30, Jaka Setia, Bekasi Selatan 17147</p><a href="https://maps.google.com/?q=Grand+Galaxy+City+Bekasi" target="_blank" rel="noreferrer">Buka peta ↗</a></div><div className="map-art"><span>G</span><i className="map-pin">⌖</i><b>GRAND GALAXY CITY</b><small>BEKASI SELATAN</small></div></div>
    </div><footer><a className="brand" href="https://haltev.id"><img className="brand-logo" src="/logo-haltev.png" alt="" /><span>haltev<span className="brand-dot">.</span></span></a><span>© 2026 Haltev · Belajar skill digital, satu langkah demi satu langkah.</span><a href="https://haltev.id" target="_blank" rel="noreferrer">Tentang Haltev ↗</a></footer>
  </main>;
}
