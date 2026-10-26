import React from 'react';
import { ArrowRight, Download, Mail, Phone, Github, Linkedin, Sparkles, Database, Brain, Code2 } from 'lucide-react';
import { getFileUrl } from '../services/api';
import defaultPhoto from '../assets/harish_kumar.jpg';

export const Hero = ({ profile }) => {
  const photoSrc = profile?.photo_url ? getFileUrl(profile.photo_url) : defaultPhoto;

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden">
      {/* Background Glows */}
      <div className="bg-glow-purple -top-20 -left-20 animate-pulse-subtle"></div>
      <div className="bg-glow-cyan top-1/2 -right-20 animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Hero Content */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-brand-purple/30 text-xs font-medium text-slate-200 shadow-sm animate-fade-in">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>Available for Data Science & Developer Roles</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-2">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Hi, I'm <span className="gradient-text">Harish Kumar</span>
              </h1>
              <p className="text-lg sm:text-2xl font-semibold text-emerald-300 flex items-center justify-center lg:justify-start gap-2">
                <span>M.Sc. Data Science Student & Tech Innovator</span>
              </p>
            </div>

            {/* Short Introduction */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {profile?.bio ||
                "Passionate M.Sc. Data Science student dedicated to transforming raw data into predictive intelligence and crafting scalable full-stack web architectures. Bridging advanced machine learning models with high-performance web applications."}
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
              <div className="glass-card p-2.5 sm:p-3 rounded-xl text-center border-slate-800">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-emerald-400 mb-1" />
                <div className="text-[11px] sm:text-xs font-semibold text-slate-200">Data Science</div>
                <div className="text-[9px] sm:text-[10px] text-slate-400">ML & Analytics</div>
              </div>
              <div className="glass-card p-2.5 sm:p-3 rounded-xl text-center border-slate-800">
                <Code2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-teal-400 mb-1" />
                <div className="text-[11px] sm:text-xs font-semibold text-slate-200">Full-Stack</div>
                <div className="text-[9px] sm:text-[10px] text-slate-400">React & Flask</div>
              </div>
              <div className="glass-card p-2.5 sm:p-3 rounded-xl text-center border-slate-800">
                <Database className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-cyan-400 mb-1" />
                <div className="text-[11px] sm:text-xs font-semibold text-slate-200">Databases</div>
                <div className="text-[9px] sm:text-[10px] text-slate-400">SQL & Modeling</div>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-3">
              <button
                onClick={() => scrollToSection('projects')}
                className="w-full sm:w-auto min-h-[46px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 shadow-lg shadow-emerald-500/25 hover:shadow-cyan-400/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>View My Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {profile?.resume_url ? (
                <a
                  href={getFileUrl(profile.resume_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto min-h-[46px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-white glass-panel border border-white/10 hover:border-emerald-500/40 hover:bg-white/5 transition-all transform hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>Download Resume</span>
                </a>
              ) : (
                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full sm:w-auto min-h-[46px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-white glass-panel border border-white/10 hover:border-emerald-500/40 hover:bg-white/5 transition-all transform hover:-translate-y-0.5"
                >
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>Contact Me</span>
                </button>
              )}

              <button
                onClick={() => scrollToSection('about')}
                className="w-full sm:w-auto min-h-[46px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <span>About Me</span>
              </button>
            </div>

            {/* Quick Contact & Socials Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-4 text-xs text-slate-400 border-t border-white/10">
              <a
                href={`tel:${profile?.mobile || '6380178269'}`}
                className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors py-1"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>+91 {profile?.mobile || '6380178269'}</span>
              </a>

              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors py-1"
                >
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{profile.email}</span>
                </a>
              )}

              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-white transition-colors py-1"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}

              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-sky-400 transition-colors py-1"
                >
                  <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Harish Kumar's Actual Photograph */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group max-w-full">
              {/* Outer Gradient Halo Glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 rounded-3xl blur-xl opacity-60 group-hover:opacity-85 transition duration-1000 group-hover:duration-200 animate-pulse-subtle"></div>

              {/* Photo Frame Container */}
              <div className="relative rounded-3xl p-2 glass-panel border border-white/20 shadow-2xl bg-navy-900/80 overflow-hidden">
                <div className="w-full max-w-[270px] xs:max-w-xs sm:w-80 md:w-96 aspect-[4/5] overflow-hidden rounded-2xl relative bg-slate-900 mx-auto">
                  <img
                    src={photoSrc}
                    alt="Harish Kumar - M.Sc. Data Science"
                    className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.03] transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultPhoto;
                    }}
                  />

                  {/* Gradient Overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent flex flex-col justify-end p-4">
                    <div className="text-white font-bold text-base sm:text-lg flex items-center justify-between">
                      <span>Harish Kumar</span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        M.Sc. DS
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-300">Data Science Student & Tech Innovator</div>
                  </div>
                </div>

                {/* Floating Micro Badge */}
                <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 glass-panel border border-white/15 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 sm:gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] sm:text-xs font-semibold text-white">Full-Stack & ML</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
