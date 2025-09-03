import type { Metadata } from "next";
import "./globals.css";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'NebulaTech - Servizi Cloud Computing Professionali',
  description: 'NebulaTech offre soluzioni cloud computing avanzate per hosting, storage e scalabilità. Servizi professionali per la tua azienda.',
  keywords: ['cloud computing', 'hosting', 'storage', 'scalabilità', 'servizi cloud', 'NebulaTech'],
  authors: [{ name: 'NebulaTech' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <head>
      </head>
      <body className="antialiased">
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
