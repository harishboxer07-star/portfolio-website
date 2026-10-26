import React, { useState } from 'react';
import { Cpu, Code2, Brain, Database, Server, Wrench, Layers } from 'lucide-react';

const CATEGORY_ICONS = {
  'Programming Languages': Code2,
  'Data Science and Machine Learning': Brain,
  'Frontend Development': Layers,
  'Backend Development': Server,
  'Databases': Database,
  'Tools and Technologies': Wrench,
};

export const Skills = ({ skillsByCategory = {}, allSkills = [] }) => {
  const categories = Object.keys(skillsByCategory);
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter skills based on selected category tab
  const displayedCategories = activeCategory === 'All'
    ? categories
    : categories.filter((cat) => cat === activeCategory);

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-navy-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50">
            <Cpu className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Skills & <span className="gradient-text">Proficiencies</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Structured skill sets spanning core data science libraries, modern web frameworks, and production tools.
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap sm:justify-center pb-3 sm:pb-0 mb-10 sm:mb-12 px-1">
            <button
              onClick={() => setActiveCategory('All')}
              className={`shrink-0 px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === 'All'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'glass-panel text-slate-300 hover:text-white hover:bg-white/5 border-white/5'
              }`}
            >
              All Categories ({allSkills.length})
            </button>
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat] || Cpu;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'glass-panel text-slate-300 hover:text-white hover:bg-white/5 border-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{cat}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/30 text-slate-300">
                    {skillsByCategory[cat]?.length || 0}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Categories & Skills Display */}
        {displayedCategories.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl max-w-md mx-auto p-8">
            <Cpu className="w-10 h-10 mx-auto text-slate-500 mb-3" />
            <div className="text-lg font-semibold text-white">No skills added yet</div>
            <p className="text-sm text-slate-400 mt-1">Skills added via the Tech Innovator Dashboard will appear here dynamically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCategories.map((category) => {
              const Icon = CATEGORY_ICONS[category] || Cpu;
              const catSkills = skillsByCategory[category] || [];

              return (
                <div
                  key={category}
                  className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between"
                >
                  <div>
                    {/* Category Title */}
                    <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/10">
                      <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base leading-snug">{category}</h3>
                        <span className="text-xs text-slate-400">{catSkills.length} skills mastered</span>
                      </div>
                    </div>

                    {/* Skills Progress List */}
                    <div className="space-y-4">
                      {catSkills.map((skill) => (
                        <div key={skill.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-slate-200">{skill.name}</span>
                            <span className="text-emerald-400 font-semibold">{skill.proficiency_level}%</span>
                          </div>
                          
                          {/* Animated bar track */}
                          <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden p-0.5">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-1000"
                              style={{ width: `${skill.proficiency_level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Badges footer */}
                  <div className="pt-5 mt-5 border-t border-white/5 flex flex-wrap gap-1.5">
                    {catSkills.map((s) => (
                      <span
                        key={s.id}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
