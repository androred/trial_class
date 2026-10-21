import type { Metadata } from 'next';
import './styles.css';

export const metadata: Metadata = {
  title: 'Coba Kelas Gratis 1 Jam | Haltev',
  description: 'Pilih kelas trial gratis Haltev dan temukan jadwal yang cocok.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
