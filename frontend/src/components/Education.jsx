import React from 'react';
import { GraduationCap, Calendar, Award, Building2 } from 'lucide-react';

export const Education = ({ education = [] }) => {
  return (
    <section id="education" className="py-24 relative overflow-hidden bg-navy-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Education & <span className="gradient-text">Qualifications</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Academic qualifications establishing the quantitative, mathematical, and computer science foundations.
          </p>
        </div>

        {/* Education Timeline */}
        {education.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl max-w-md mx-auto p-8">
            <GraduationCap className="w-12 h-12 mx-auto text-slate-500 mb-3" />
            <div className="text-lg font-semibold text-white">No education records added yet</div>
            <p className="text-sm text-slate-400 mt-1">Add education details from the Tech Innovator Dashboard.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto relative">
            {/* Center Timeline Spine on desktop */}
            <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-400 to-cyan-500/20" />

            {/* Left Timeline Spine on mobile */}
            <div className="md:hidden absolute left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-500 via-teal-400 to-cyan-500/20" />

            <div className="space-y-6 sm:space-y-12">
              {education.map((item, index) => {
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={item.id}
                    className={`relative flex flex-col md:flex-row items-start md:items-center ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Timeline Node Icon (Desktop) */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-navy-900 border-2 border-emerald-500 items-center justify-center text-emerald-300 shadow-lg shadow-emerald-500/20 z-10">
                      <GraduationCap className="w-5 h-5" />
                    </div>

                    {/* Timeline Node Icon (Mobile) */}
                    <div className="md:hidden absolute left-4 -translate-x-1/2 top-6 w-7 h-7 rounded-full bg-navy-900 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-md shadow-emerald-500/30 z-10">
                      <GraduationCap className="w-3.5 h-3.5" />
                    </div>

                    {/* Timeline Card */}
                    <div className={`w-full pl-10 md:pl-0 md:w-[calc(50%-2.5rem)] ${isEven ? 'md:pl-4' : 'md:pr-4'}`}>
                      <div className="glass-card p-5 sm:p-7 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all">
                        {/* Period & Degree Tag */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            <span>{item.start_year || '—'} - {item.end_year || 'Present'}</span>
                          </span>

                          {item.grade && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              <span>{item.grade}</span>
                            </span>
                          )}
                        </div>

                        {/* Degree Title */}
                        <h3 className="text-base sm:text-xl font-bold text-white mb-1">
                          {item.degree}
                        </h3>

                        {/* Institution */}
                        <div className="text-xs sm:text-sm font-medium text-slate-300 mb-3 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{item.institution}</span>
                          {item.field_of_study && <span>• {item.field_of_study}</span>}
                        </div>

                        {/* Description */}
                        {item.description && (
                          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-2 border-t border-white/5">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
