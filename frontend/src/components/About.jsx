import React from 'react';
import { Target, Compass, Zap, GraduationCap, Award, CheckCircle2, User } from 'lucide-react';

export const About = ({ profile, education }) => {
  const highestEdu = education && education.length > 0 ? education[0] : null;

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50">
            <User className="w-3.5 h-3.5" />
            <span>Discover My Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Bridging analytical data exploration with modern full-stack web software engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Biography & Main Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10 relative">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Professional Biography</span>
              </h3>
              
              <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
                <p>
                  {profile?.bio ||
                    "I am Harish Kumar, currently pursuing my Master of Science in Data Science. My academic and technical journey revolves around the synthesis of mathematical modeling, machine learning, and scalable software application engineering."}
                </p>
                <p>
                  With an analytical foundation in statistical learning and algorithmic data handling, I thrive on engineering end-to-end solutions—from exploratory data preprocessing and feature extraction to training predictive models and architecting intuitive web user interfaces with React and Python Flask.
                </p>
              </div>

              {/* Academic Highlight Callout */}
              {highestEdu && (
                <div className="mt-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wide">Current Academic Pursuit</div>
                    <div className="text-sm font-bold text-white mt-0.5">{highestEdu.degree}</div>
                    <div className="text-xs text-slate-300">{highestEdu.institution} • {highestEdu.start_year} - {highestEdu.end_year}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Strengths Card */}
            <div className="glass-card p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>Personal Strengths</span>
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {profile?.personal_strengths ||
                  "Analytical problem solving, rapid adaptation to emerging technologies, strong commitment to clean code quality, and cooperative team communication."}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Analytical Mindset & Rigor</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Rapid Tech Adaptation</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>End-to-End System Vision</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Effective Collaborative Spirit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Career Interests & Professional Goals */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Career Interests */}
            <div className="glass-card p-6 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2.5 text-emerald-400 mb-3">
                <Compass className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white">Career Interests</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {profile?.career_interests ||
                  "Machine Learning, Deep Learning, Predictive Analytics, Natural Language Processing, Full-Stack Web Development, Cloud Computing, and Data Engineering."}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {["Machine Learning", "Data Science", "React & Frontend", "Python & Flask APIs", "SQL & Databases", "Data Engineering"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-emerald-300 border border-emerald-800/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Professional Goals */}
            <div className="glass-card p-6 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2.5 text-teal-400 mb-3">
                <Target className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white">Professional Goals</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {profile?.professional_goals ||
                  "To leverage statistical modeling and software architecture to engineer impactful AI-driven products, collaborate with world-class engineering teams, and continuously evolve into an adaptable end-to-end technologist."}
              </p>
            </div>

            {/* Quick Contact Info Snippet */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-navy-900/80">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>Direct Contact Information</span>
              </h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Name:</span>
                  <span className="font-semibold text-white">Harish Kumar</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Degree:</span>
                  <span className="font-semibold text-cyan-300">M.Sc. Data Science</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-semibold text-white">+91 6380178269</span>
                </div>
                {profile?.location && (
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-semibold text-white">{profile.location}</span>
                  </div>
                )}
                {profile?.email && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-semibold text-white">{profile.email}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
