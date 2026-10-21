# PRD – Website Pendaftaran Trial Class Haltev

Oct 21, 2026 · @Haltev · Draft v0.2

## 1. Ringkasan

Website ini adalah aplikasi web terpisah tempat calon siswa yang masih ragu, setelah chat dengan sales Haltev, mendaftar Trial Class gratis 1 jam. Pendaftaran langsung membuat undangan Google Calendar untuk tutor dan calon siswa, dan datanya tercatat di Google Sheets.

**Latar belakang.** Haltev (PT Haltekom Media Inovasi) adalah lembaga kursus skill digital berbasis AI dengan kelas semi-private. Banyak calon siswa sudah chat dengan sales tetapi masih ragu mengambil kelas penuh. Trial Class menjadi alat follow-up sales: calon siswa mencoba kelas dulu sebelum memutuskan.

**Solusi.** Sales mengirim link pendaftaran trial ke calon siswa. Calon siswa memilih kelas (Data Science, Digital Marketing, Web Development, atau Mobile Development), memilih slot online atau offline di Grand Galaxy City, lalu mengisi form singkat. Sistem mengurangi kuota slot, menambahkan baris di Google Sheets, dan mengirim undangan Google Calendar ke tutor dan calon siswa. Tutor mengatur jadwal trial kelasnya sendiri.

**Ketentuan utama:** gratis, durasi ±1 jam, maksimal 5 peserta per slot, 1 hari trial per minggu, lokasi offline hanya di Grand Galaxy City (Bekasi Selatan) plus opsi online, dibangun dengan kode custom dan di-hosting di Vercel.

## 2. Tujuan dan metrik keberhasilan

**Tujuan**

- Memberi calon siswa yang ragu cara mudah mencoba kelas tanpa biaya.
- Membuat jadwal trial langsung masuk ke kalender tutor dan calon siswa.
- Mengumpulkan semua data pendaftar trial di satu Google Sheets untuk follow-up sales.
- Mengukur berapa peserta trial yang lanjut mendaftar kursus atau bootcamp.

**Non-tujuan (di luar cakupan versi ini)**

- Pembayaran (trial gratis; pendaftaran kursus penuh tetap lewat sales).
- Notifikasi otomatis via WhatsApp API.
- Halaman marketing/SEO untuk menarik trafik baru (situs utama haltev.id tetap dipakai untuk itu).
- Aplikasi mobile native dan portal member.

| Metrik | Definisi | Target awal (usulan) |
| --- | --- | --- |
| Link → daftar | Pendaftar ÷ jumlah link yang dikirim sales | ≥ 60% |
| Waktu isi form | Median dari buka link sampai submit | < 2 menit |
| Show-up rate | Peserta hadir ÷ peserta terdaftar | ≥ 75% |
| Trial → daftar kursus | Peserta hadir yang mendaftar kursus/bootcamp dalam 14 hari | ≥ 30% |
| Keterisian slot | Kursi terisi ÷ (slot × 5) per minggu | ≥ 60% |

Angka target adalah usulan awal; sesuaikan setelah 1 bulan data baseline.

## 3. Target pengguna

Pengguna utama adalah calon siswa yang sudah chat dengan sales tetapi belum yakin. Di belakang layar ada sales yang mengirim link, tutor yang mengatur jadwal dan mengajar, serta admin yang memantau data.

| Persona | Kebutuhan utama | Kendala saat ini |
| --- | --- | --- |
| Calon siswa ragu (career switcher, mahasiswa, karyawan) | Mencoba kelas gratis, yakin bisa mengikuti tanpa basic IT, jadwal yang pasti | Ragu membayar kelas penuh sebelum mencoba |
| Sales | Mengirim satu link, tahu kapan calon siswanya daftar dan hadir, follow-up setelah trial | Jadwal trial diatur manual lewat chat |
| Tutor | Membuka slot trial kelasnya sendiri, tahu siapa yang datang dan latar belakangnya, jadwal masuk kalender | Daftar peserta dikirim manual |
| Admin / manajer sales | Lihat semua data trial dan konversi di Google Sheets | Data tersebar di chat |

Calon siswa hampir selalu datang dari link yang dikirim sales via WhatsApp dan membukanya di smartphone, jadi halaman harus ringan dan langsung ke inti.

## 4. User journey dan user stories

&#91;embedded content: alur pendaftaran trial · 9 langkah, 2 keputusan\]

Slot penuh mengarahkan calon siswa ke slot lain; yang tidak hadir bisa mengatur ulang dengan tutor atau ikut slot minggu depan. Pengingat datang dari Google Calendar, bukan WhatsApp.

| ID | Sebagai… | Saya ingin… | Agar… |
| --- | --- | --- | --- |
| US-01 | Calon siswa | membuka link dari sales dan langsung melihat 4 kelas trial | cepat memilih tanpa membaca banyak |
| US-02 | Calon siswa | melihat slot yang masih tersedia, online atau offline | memilih waktu yang cocok |
| US-03 | Calon siswa | mendaftar dari HP dalam < 2 menit | tidak berubah pikiran di tengah jalan |
| US-04 | Calon siswa | menerima undangan Google Calendar | punya pengingat dan link/alamat kelas |
| US-05 | Calon siswa | ikut slot minggu depan jika berhalangan | tetap bisa mencoba |
| US-06 | Sales | mengirim link yang mencatat nama saya | tahu calon siswa mana yang sudah daftar |
| US-07 | Tutor | membuka dan mengatur slot trial kelas saya sendiri | jadwal sesuai ketersediaan saya |
| US-08 | Tutor | menerima undangan kalender berisi data peserta | siap sebelum kelas |
| US-09 | Tutor | menandai hadir/tidak hadir | sales bisa follow-up dengan tepat |
| US-10 | Admin | melihat semua data di Google Sheets | memantau konversi trial ke kursus |

## 5. Kebutuhan fungsional (sisi pelanggan)

Prioritas: **P0** = wajib di MVP, **P1** = sebaiknya ada di MVP, **P2** = fase berikutnya.

**5.0 Kelas yang dibuka untuk trial**

| Kelas | Program Haltev lanjutan | Materi trial (usulan, ±1 jam) | Cocok untuk |
| --- | --- | --- | --- |
| Data Science | Intro to Python & AI for Data Science; AI Machine Learning & Data Science Bootcamp | Menjalankan kode Python pertama dan membuat grafik dari dataset kecil dengan bantuan AI | Non-IT yang ingin jadi data analyst/scientist |
| Digital Marketing | Digital Marketing with AI; AI Digital Marketing Specialist Bootcamp | Membuat satu konten/iklan dengan AI dan membaca metrik dasarnya | Pelaku UMKM, marketer, career switcher |
| Web Development | AI-Powered Website Programming; Laravel / React / Django; Fullstack Website Bootcamp | Membuat satu halaman web sederhana dengan bantuan AI | Pemula yang ingin jadi web developer |
| Mobile Development | AI-Powered Android App Development; Kotlin / React Native / Flutter; Fullstack Android Bootcamp | Menjalankan aplikasi Android sederhana di emulator atau HP | Pemula yang ingin jadi mobile developer |

Materi trial di atas adalah usulan dan perlu disetujui tim akademik Haltev.

**5.1 Halaman trial**

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| F-01 | Satu halaman ringkas: judul "Coba Kelas Gratis 1 Jam", lalu langsung pilihan kelas, tanpa konten marketing panjang | P0 |
| F-02 | 4 kartu kelas: deskripsi singkat, materi trial, tutor, tombol pilih | P0 |
| F-03 | Info trial: gratis, ±1 jam, maks. 5 peserta, perlu laptop (offline) atau laptop + koneksi internet (online) | P0 |
| F-04 | Ringkasan keunggulan Haltev dalam satu baris (kelas kecil, kurikulum AI, penyaluran kerja) dan link ke haltev.id | P1 |
| F-05 | Tombol WhatsApp ke sales yang mengirim link (jika parameter sales ada), atau ke admin (0878 0009 2728) | P0 |
| F-06 | Parameter sales di link, misalnya `?sales=rina`, tersimpan bersama pendaftaran | P0 |
| F-07 | Alamat dan peta Grand Galaxy City untuk peserta offline | P0 |

**5.2 Pemilihan jadwal**

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| F-10 | Setelah memilih kelas, tampilkan slot trial yang dibuka tutor kelas tersebut untuk 2–4 minggu ke depan | P0 |
| F-11 | Setiap slot menampilkan tanggal, jam (WIB), mode (Online / Offline di Grand Galaxy City), nama tutor, dan sisa kursi dari 5 | P0 |
| F-12 | Satu slot dapat menerima peserta online dan offline sekaligus, atau tutor memilih salah satu mode (ditentukan tutor saat membuat slot) | P1 |
| F-13 | Slot penuh tampil "Penuh"; calon siswa diarahkan ke slot minggu berikutnya | P0 |
| F-14 | Pendaftaran tutup H-3 jam sebelum slot dimulai | P0 |
| F-15 | Kuota aman dari double-booking saat beberapa orang mendaftar bersamaan | P0 |

**5.3 Form pendaftaran**

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| F-20 | Field wajib: nama lengkap, nomor WhatsApp, email (dipakai untuk undangan Google Calendar), kelas, slot, mode online/offline | P0 |
| F-21 | Status saat ini: pelajar/mahasiswa, fresh graduate, karyawan, wirausaha, lainnya | P0 |
| F-22 | Latar belakang IT (ya/tidak) dan tujuan: cari kerja, pindah karier, upskill, bisnis | P0 |
| F-23 | Nama sales yang menghubungi (terisi otomatis dari link, bisa dipilih manual jika kosong) | P0 |
| F-24 | Hal yang membuat ragu ikut kelas penuh (opsional, teks singkat) untuk bahan tutor dan sales | P1 |
| F-25 | Validasi format nomor WA Indonesia dan email; 1 email/nomor WA = 1 trial per kelas | P0 |
| F-26 | Persetujuan kebijakan privasi dan proteksi anti-spam (misalnya Cloudflare Turnstile) | P0 |

**5.4 Setelah daftar**

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| F-30 | Halaman sukses: ringkasan kelas, jadwal, tutor, alamat atau info link online, dan pesan "cek email untuk undangan kalender" | P0 |
| F-31 | Undangan Google Calendar terkirim ke email calon siswa, dengan tutor sebagai penyelenggara | P0 |
| F-32 | Untuk slot online: undangan berisi link Google Meet otomatis | P0 |
| F-33 | Pengingat kalender default: 1 hari dan 1 jam sebelum kelas | P0 |
| F-34 | Berhalangan hadir: calon siswa menghubungi tutor/sales, atau mendaftar lagi di slot minggu depan lewat link yang sama | P0 |

## 6. Kebutuhan tutor dan admin

Setiap tutor memegang kuasa penuh atas jadwal trial kelasnya. Tutor dan admin login dengan akun Google (Sign in with Google), hanya untuk email yang didaftarkan admin. Ada dua peran: **Tutor** (mengelola slot dan peserta kelasnya sendiri) dan **Admin** (mengelola tutor, kelas, dan melihat semua data). Sales tidak perlu login; mereka memakai link dengan parameter nama dan melihat data di Google Sheets.

| ID | Kebutuhan | Peran | Prioritas |
| --- | --- | --- | --- |
| A-01 | Buat slot trial: tanggal, jam mulai (durasi default 60 menit), mode online/offline, kuota (default 5) | Tutor | P0 |
| A-02 | Template slot mingguan: hari dan jam tetap, otomatis dibuka untuk 4 minggu ke depan | Tutor | P1 |
| A-03 | Ubah atau batalkan slot; peserta terdampak otomatis menerima pembaruan kalender | Tutor | P0 |
| A-04 | Lihat daftar peserta per slot beserta status, latar belakang, tujuan, dan nama sales | Tutor | P0 |
| A-05 | Tandai Hadir / Tidak hadir dan tulis catatan singkat setelah kelas | Tutor | P0 |
| A-06 | Pindahkan peserta ke slot lain (hasil diskusi reschedule) | Tutor | P1 |
| A-07 | Kelola daftar tutor (email Google) dan kelas yang diampu | Admin | P0 |
| A-08 | Kelola daftar sales (nama dan nomor WA) untuk parameter link | Admin | P0 |
| A-09 | Batasi trial maksimal 1 hari per minggu per kelas (aturan bisa diubah admin) | Admin | P1 |
| A-10 | Lihat semua slot dan peserta lintas kelas | Admin | P1 |

Status pendaftar di Google Sheets: Terdaftar → Hadir / Tidak hadir → Daftar kursus / Tidak lanjut. Kolom konversi diisi sales.

## 7. Kebutuhan non-fungsional

| Aspek | Kebutuhan |
| --- | --- |
| Hosting | Vercel (production + preview per branch); domain misalnya trial.haltev.id |
| Performa | Halaman termuat < 2 detik di 4G; skor Lighthouse mobile ≥ 90 |
| Mobile-first | Alur daftar nyaman di layar 360 px |
| Konkurensi | Pengecekan kuota dan penulisan data dalam satu transaksi/lock agar slot tidak melebihi 5 |
| Keamanan | Kredensial Google (service account / OAuth) hanya di environment variables Vercel; rate limiting form; endpoint admin hanya untuk sesi login |
| Privasi data | Sesuai UU No. 27/2022 tentang Pelindungan Data Pribadi: persetujuan eksplisit, akses Google Sheets terbatas pada tim Haltev |
| Visibilitas | Halaman di-`noindex` karena hanya dibagikan lewat sales |
| Zona waktu | Semua jadwal dalam WIB (Asia/Jakarta) |
| Ketersediaan | Mengikuti SLA Vercel dan Google API; jika Google API gagal, pendaftaran tetap tersimpan dan dicoba ulang |

## 8. Data, integrasi Google, dan teknologi

**Struktur Google Sheets** (satu spreadsheet, beberapa tab)

| Tab | Kolom penting |
| --- | --- |
| Pendaftar | ID, waktu daftar, nama, no. WA, email, kelas, slot (tanggal + jam), mode, tutor, sales, status saat ini, latar belakang IT, tujuan, alasan ragu, status (Terdaftar/Hadir/Tidak hadir), catatan tutor, konversi (Daftar kursus/Tidak lanjut), ID event kalender |
| Slot | ID slot, kelas, tutor, tanggal, jam mulai–selesai, mode, kuota, terisi, status (Buka/Penuh/Batal), ID event kalender |
| Tutor | nama, email Google, kelas yang diampu, aktif |
| Sales | nama, kode link, nomor WA |

**Integrasi**

| Integrasi | Fungsi | Prioritas |
| --- | --- | --- |
| Google Sheets API | Menyimpan dan membaca data pendaftar, slot, tutor, sales | P0 |
| Google Calendar API | Satu event per slot di kalender tutor; setiap pendaftar ditambahkan sebagai tamu (undangan + pengingat via email Google) | P0 |
| Google Meet (via Calendar API) | Link Meet otomatis untuk slot online | P0 |
| Google Sign-In (OAuth) | Login tutor dan admin | P0 |
| Google Analytics 4 | Mengukur kunjungan link dan penyelesaian form | P1 |

**Notifikasi (semua lewat Google Calendar)**

| Pemicu | Yang terjadi | Penerima |
| --- | --- | --- |
| Pendaftaran berhasil | Calon siswa ditambahkan sebagai tamu di event slot; undangan terkirim ke email | Calon siswa; tutor melihat tamu baru |
| 1 hari dan 1 jam sebelum kelas | Pengingat kalender | Calon siswa dan tutor |
| Tutor mengubah atau membatalkan slot | Event diperbarui, pembaruan terkirim otomatis | Semua tamu |
| Peserta dipindah slot | Dihapus dari event lama, ditambahkan ke event baru | Calon siswa |

Konfirmasi lewat WhatsApp tetap dilakukan manual oleh sales jika perlu; sistem tidak mengirim pesan WhatsApp otomatis.

**Usulan teknologi:** Next.js (React + TypeScript) di Vercel, API route/server action untuk logika daftar, Google APIs lewat service account dengan domain-wide delegation (atau OAuth per tutor) agar event dibuat di kalender tutor. Google Sheets dipakai sebagai database pada MVP; jika volume atau kebutuhan lock bertambah, data utama bisa dipindah ke database (misalnya Vercel Postgres) dengan Sheets sebagai salinan untuk tim.

## 9. Ruang lingkup rilis dan timeline

MVP (semua item P0) diperkirakan siap live dalam sekitar 4 minggu dengan 1 developer full-stack; estimasi perlu divalidasi developer.

| Fase | Durasi (usulan) | Cakupan | Kriteria selesai |
| --- | --- | --- | --- |
| 0. Persiapan | Minggu 1 | Finalkan materi trial per kelas, daftar tutor dan sales, siapkan Google Workspace (service account, spreadsheet, kalender tutor), domain | Akses Google API siap |
| 1. Desain dan pengembangan | Minggu 1–3 | Halaman trial, pilihan slot, form, integrasi Sheets + Calendar + Meet, portal tutor | Semua P0 berjalan di preview Vercel |
| 2. UAT dan soft launch | Minggu 4 | Uji oleh 4 tutor dan sales dengan 5–10 calon siswa nyata | Undangan kalender diterima, data masuk Sheets, tidak ada bug kritis |
| 3. Fase 2 | Setelah live + 1 bulan | Item P1: template slot mingguan, pindah slot, GA4, alasan ragu | Berdasarkan data bulan pertama |

## 10. Asumsi, risiko, dan pertanyaan terbuka

**Asumsi**

- Trial gratis, ±1 jam, maks. 5 peserta per slot, untuk 4 kelas.
- Offline hanya di Grand Galaxy City (Jl. Boulevard Raya Barat Blok RGA No. 30, Jaka Setia, Bekasi Selatan 17147); online via Google Meet.
- Trial dibuka 1 hari per minggu; tutor menentukan hari dan jamnya.
- Haltev memakai Google Workspace sehingga tutor punya akun Google dan kalender.
- Satu orang hanya boleh ikut satu trial per kelas.

**Risiko**

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Undangan kalender masuk spam atau tidak dibuka | Calon siswa lupa jadwal | Halaman sukses meminta cek email; sales mengingatkan manual via WA H-1 |
| Calon siswa tanpa akun Google | Pengingat kurang terlihat | Undangan tetap terkirim ke email apa pun; tambah tombol "Tambah ke kalender" (.ics) |
| Dua orang mendaftar slot terakhir bersamaan | Slot melebihi 5 | Lock saat cek kuota; Sheets hanya sebagai salinan jika perlu |
| Batas kuota (rate limit) Google API | Pendaftaran gagal saat ramai | Antrian retry; volume trial mingguan kecil sehingga risiko rendah |
| Tutor lupa membuka slot | Tidak ada jadwal yang bisa dipilih | Template slot mingguan dan pengingat ke admin jika minggu depan kosong |

**Pertanyaan terbuka**

- [x] Trial gratis
- [x] Lokasi: Grand Galaxy City + online
- [x] Kuota 5 per slot, 1 hari per minggu, dijadwalkan tutor
- [x] Durasi ±1 jam
- [x] Aplikasi terpisah, kode custom, hosting Vercel
- [x] Reschedule: diskusi dengan tutor atau ikut slot minggu depan
- [x] Output: Google Calendar (tutor + calon siswa) dan Google Sheets
- [ ] Apakah Haltev memakai Google Workspace (email @haltev.id) untuk semua tutor?
- [ ] Apakah hari trial sama untuk semua kelas, atau tiap tutor bebas memilih hari?
- [ ] Dalam satu slot, apakah online dan offline digabung (hybrid) atau dipisah?
- [ ] Siapa developer dan berapa anggaran serta target tanggal live?
- [ ] Apakah sales perlu dashboard sendiri, atau cukup Google Sheets?

## Sumber

- [Haltev – Kursus AI Native: Programming, Data Science & Digital Marketing](https://haltev.id), diakses 21 Oktober 2026
