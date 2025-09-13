import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="text-white" style={{backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 stagger-animation">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-blue-400 mb-4 block animate-fade-in-up">
              NebulaTech
            </Link>
            <p className="mb-4 max-w-md animate-fade-in-up animate-delay-100" style={{color: 'var(--text-secondary)'}}>
              La tua soluzione cloud di fiducia. Offriamo servizi di hosting, storage e scalabilità 
              per aziende di ogni dimensione.
            </p>

          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Link Rapidi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-blue-400 hover:translate-x-1 transition-all duration-300" style={{color: 'var(--text-secondary)'}}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/servizi" className="hover:text-blue-400 hover:translate-x-1 transition-all duration-300" style={{color: 'var(--text-secondary)'}}>
                  Servizi
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="hover:text-blue-400 hover:translate-x-1 transition-all duration-300" style={{color: 'var(--text-secondary)'}}>
                  Contatti
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servizi</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/servizi#hosting" className="hover:text-blue-400 hover:translate-x-1 transition-all duration-300" style={{color: 'var(--text-secondary)'}}>
                  Hosting
                </Link>
              </li>
              <li>
                <Link href="/servizi#storage" className="hover:text-blue-400 hover:translate-x-1 transition-all duration-300" style={{color: 'var(--text-secondary)'}}>
                  Storage
                </Link>
              </li>
              <li>
                <Link href="/servizi#scalabilita" className="hover:text-blue-400 hover:translate-x-1 transition-all duration-300" style={{color: 'var(--text-secondary)'}}>
                  Scalabilità
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center" style={{borderColor: 'var(--border-secondary)'}}>
          <p style={{color: 'var(--text-tertiary)'}}>
            © 2025 NebulaTech. Tutti i diritti riservati.
          </p>
          <p className="mt-2" style={{color: 'var(--text-tertiary)'}}>
            <a href="https://nebulatech.online" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
              nebulatech.online
            </a>
          </p>
          <p className="text-sm mt-2" style={{color: 'var(--text-tertiary)'}}>
            Versione 0.1.0
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;