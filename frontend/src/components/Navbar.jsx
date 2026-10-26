import React, { useState, useEffect } from 'react';
import { Menu, X, Download, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFileUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ profile }) => {
  const { isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'py-3 glass-panel border-b shadow-lg shadow-black/20'
            : 'py-4 sm:py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#home"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center font-bold text-white shadow-md shadow-brand-purple/30 group-hover:scale-105 transition-transform text-sm sm:text-base">
              HK
            </div>
            <div>
              <div className="font-bold text-base sm:text-lg text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                <span>Harish Kumar</span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-400">M.Sc. Data Science</div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {profile?.resume_url ? (
              <a
                href={getFileUrl(profile.resume_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Resume</span>
              </a>
            ) : (
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#contact');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800/80 border border-white/10 hover:border-emerald-500/40 hover:bg-slate-700/60 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>Get In Touch</span>
              </a>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl border border-white/10 text-slate-200 hover:text-white bg-slate-900/80 hover:bg-white/10 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-3 pb-6 mt-3 space-y-1 animate-fade-in shadow-2xl">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className="flex items-center w-full min-h-[44px] text-left px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/10 active:bg-white/15 transition-colors"
              >
                {link.name}
              </button>
            ))}

            <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2.5">
              {profile?.resume_url ? (
                <a
                  href={getFileUrl(profile.resume_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full min-h-[44px] py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md shadow-emerald-600/30"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </a>
              ) : (
                <button
                  onClick={() => handleNavClick('#contact')}
                  className="flex items-center justify-center gap-2 w-full min-h-[44px] py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-800/80 border border-white/10 hover:border-emerald-500/40"
                >
                  <span>Contact Me</span>
                </button>
              )}

              <Link
                to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 text-xs text-slate-400 hover:text-emerald-300 transition-colors"
                title="Tech Innovator Access"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tech Innovator</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};
