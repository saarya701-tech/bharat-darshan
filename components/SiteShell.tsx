
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Landmark, Menu, X, Sun, Moon } from 'lucide-react';
import AudioToggle from './audio-toggle';

const links = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/heritage-map', label: 'Heritage Map' },
  { href: '/my-journey', label: 'My Journey' },
  { href: '/virtual-experience', label: 'Virtual Heritage' },
  { href: '/about', label: 'About' },
];

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [themeReady, setThemeReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem('bharat-darshan-theme');
    const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';

    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    document.documentElement.style.colorScheme = initialTheme;
    setThemeReady(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';

    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem('bharat-darshan-theme', nextTheme);
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <div className="site-shell royal-shell">
      <header className="topbar royal-topbar">
        <Link
          href="/"
          className="brand"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-mark">
            <Landmark size={26} />
          </span>

          <span>
            <b>भारत दर्शन</b>
            <small>HERITAGE ATLAS OF INDIA</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? 'nav-active' : ''}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-tools">
          <span className="language">
            EN <i>|</i> हिन्दी
          </span>

          <AudioToggle />

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            disabled={!themeReady}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
            <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

          <button
            type="button"
            className="mobile-menu"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={isActive(link.href) ? 'nav-active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main id="main-content">
        {children}
      </main>

      <footer className="footer royal-footer">
        <div>
          <div className="footer-brand">
            ✥ भारत दर्शन · Bharat Darshan
          </div>
          <p>
            Explore · Experience · Preserve India's timeless heritage.
          </p>
        </div>

        <div className="footer-links">
          <Link href="/explore">Explore</Link>
          <Link href="/heritage-map">Heritage Map</Link>
          <Link href="/virtual-experience">Virtual Heritage</Link>
          <Link href="/sources">Sources & Credits</Link>
        </div>

        <small>
          Independent educational heritage project.
          Verify monument information with official sources.
        </small>
      </footer>
    </div>
  );
}
