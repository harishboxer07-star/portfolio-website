import React from 'react';
import { ArrowUp, Sparkles, Heart, Github, Linkedin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Footer = ({ profile }) => {
  const { isAuthenticated } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/10 bg-navy-950 py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Branding & Tagline */}
          <div className="text-center md:text-left space-y-1">
            <div className="font-bold text-lg text-white flex items-center justify-center md:justify-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span>Harish Kumar</span>
            </div>
            <p className="text-xs text-slate-400">
              M.Sc. Data Science Student & Tech Innovator
            </p>
          </div>

          {/* Center: Social Icons */}
          <div className="flex items-center gap-4 text-slate-400">
            {profile?.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl glass-panel hover:text-white hover:border-emerald-500/40 transition-colors"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {profile?.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl glass-panel hover:text-sky-400 hover:border-cyan-500/40 transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            <a
              href={`tel:${profile?.mobile || '6380178269'}`}
              className="p-2 rounded-xl glass-panel hover:text-cyan-400 transition-colors"
              title="Call Mobile"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>

          {/* Right: Back to top and Discreet Tech Innovator Portal link */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl glass-panel hover:bg-white/10 text-slate-300 hover:text-white transition-all"
              title="Scroll back to top"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>

            {/* Discreet floating Tech Innovator Login link */}
            <Link
              to={isAuthenticated ? "/admin/dashboard" : "/admin/login"}
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-emerald-300 glass-panel hover:border-emerald-500/40 transition-all cursor-pointer"
              title="Tech Innovator Access"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tech Innovator</span>
            </Link>
          </div>

        </div>

        {/* Bottom sub-footer */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            &copy; {new Date().getFullYear()} Harish Kumar. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with React, Tailwind & Flask</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
