import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JotFormAssistantManager from '@/components/JotFormAssistantManager';
import { ToastProvider } from '@/components/Toast';
import PerformanceOptimizer from '@/components/PerformanceOptimizer';


import { MobileMenuProvider, useMobileMenu } from '@/contexts/MobileMenuContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

export const metadata: Metadata = {
  title: 'NebulaTech - Servizi Cloud Computing Professionali',
  description: 'NebulaTech offre soluzioni cloud computing avanzate per hosting, storage e scalabilità. Servizi professionali per la tua azienda.',
  keywords: ['cloud computing', 'hosting', 'storage', 'scalabilità', 'servizi cloud', 'NebulaTech'],
  authors: [{ name: 'NebulaTech' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script async src='https://cdn.jotfor.ms/agent/embedjs/019940abbe6c729bacad7b7dfdd57ab9f23a/embed.js'></script>
      </head>
      <body className={`${inter.className} antialiased`} style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <MobileMenuProvider>
              <JotFormAssistantManager />
              <PerformanceOptimizer 
              preloadImages={[
                'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop',
                'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop'
              ]}
              enableServiceWorker={process.env.NODE_ENV === 'production'}
            />
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 page-transition gpu-accelerated">
                {children}
              </main>
              <Footer />
            </div>



              </MobileMenuProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
