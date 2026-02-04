'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: '首页', href: '/' },
    { name: '文章', href: '/articles' },
    { name: '建议', href: '#' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border-b border-[rgba(255,215,0,0.3)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-3 md:py-4 flex justify-between items-center">
        {/* 左侧：头像 + 站名 */}
        <div
          className="flex items-center gap-2 md:gap-3 cursor-pointer hover:scale-105 transition-transform"
          onClick={scrollToTop}
        >
          <div
            className="w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center text-xl md:text-2xl"
            style={{
              background: 'linear-gradient(135deg, var(--dragon-orange) 0%, #e67300 100%)',
              boxShadow: '0 0 20px var(--dragon-orange-glow)',
            }}
          >
            🐒
          </div>
          <span className="font-bold text-lg md:text-2xl bg-gradient-to-r from-[var(--dragon-gold)] to-[var(--dragon-orange)] bg-clip-text text-transparent tracking-wider">
            <span className="font-bangers">Double</span>
            <span className="font-zcool">兔</span>
          </span>
        </div>

        {/* 桌面端导航链接 */}
        <div className="hidden md:flex gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-zcool font-bold text-base text-white hover:text-[var(--dragon-gold)] transition-colors relative py-2 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--dragon-orange)] to-[var(--dragon-gold)] rounded-sm group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>

        {/* 移动端汉堡菜单按钮 */}
        <button
          className="md:hidden text-white text-2xl p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* 移动端下拉菜单 */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[rgba(255,215,0,0.2)]">
          <div className="px-4 py-3 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-zcool font-bold text-base text-white hover:text-[var(--dragon-gold)] transition-colors py-2 px-3 rounded-lg hover:bg-[rgba(255,107,0,0.1)]"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
