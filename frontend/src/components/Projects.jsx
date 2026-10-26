import React, { useState, useMemo } from 'react';
import { ExternalLink, Github, Search, Layers, FolderGit2, Sparkles, Filter } from 'lucide-react';
import { getFileUrl } from '../services/api';

export const Projects = ({ projects = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [projects]);

  // Filter projects by category and search
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        project.category?.toLowerCase() === selectedCategory.toLowerCase();

      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchesCategory;

      const titleMatch = project.title?.toLowerCase().includes(term);
      const descMatch = project.description?.toLowerCase().includes(term);
      const techMatch = project.tech_stack?.some((t) => t.toLowerCase().includes(term));

      return matchesCategory && (titleMatch || descMatch || techMatch);
    });
  }, [projects, selectedCategory, searchTerm]);

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50">
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Portfolio Work</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Practical applications combining machine learning models, predictive pipelines, and full-stack implementations.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10">
          
          {/* Category Pills with horizontal swipe on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap pb-2 sm:pb-0 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3.5 py-2 min-h-[38px] rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                    : 'glass-panel text-slate-300 hover:text-white hover:bg-white/5 border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects or tech..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-base sm:text-xs rounded-xl glass-input text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

        </div>

        {/* Projects Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl max-w-md mx-auto p-8">
            <FolderGit2 className="w-12 h-12 mx-auto text-slate-500 mb-3" />
            <h3 className="text-lg font-semibold text-white">No projects found</h3>
            <p className="text-sm text-slate-400 mt-1">
              Try adjusting your search criteria or category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => {
              const imageSrc = project.image_url ? getFileUrl(project.image_url) : null;

              return (
                <div
                  key={project.id}
                  className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col group"
                >
                  {/* Card Visual Header */}
                  <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-navy-900 overflow-hidden border-b border-white/5">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-tr from-navy-950 via-slate-900 to-navy-900 group-hover:scale-105 transition-transform duration-500">
                        <FolderGit2 className="w-12 h-12 text-indigo-400/60 mb-2" />
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          {project.category || 'Project'}
                        </span>
                      </div>
                    )}

                    {/* Category Overlay Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-navy-950/80 text-cyan-300 border border-white/10 backdrop-blur-md">
                        {project.category || 'General'}
                      </span>
                    </div>

                    {project.is_featured && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-600/95 text-white shadow-md shadow-emerald-600/30 backdrop-blur-md">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>Featured</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 line-clamp-4 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-2 border-t border-white/5">
                      {/* Tech Stack Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech_stack?.map((tech, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Action Links */}
                      <div className="flex flex-wrap items-center gap-2.5 pt-2">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors px-3 py-2 min-h-[38px] rounded-xl bg-white/5 hover:bg-white/10 active:scale-95"
                            title="View GitHub Repository"
                          >
                            <Github className="w-3.5 h-3.5" />
                            <span>Code</span>
                          </a>
                        )}

                        {project.live_demo_url && (
                          <a
                            href={project.live_demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors px-3 py-2 min-h-[38px] rounded-xl bg-emerald-950/60 border border-emerald-800/40 hover:bg-emerald-900/60 active:scale-95 shadow-sm"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Live Demo</span>
                          </a>
                        )}

                        {!project.github_url && !project.live_demo_url && (
                          <span className="text-[11px] text-slate-500 italic py-1">
                            Links available upon request / repo release
                          </span>
                        )}
                      </div>
                    </div>
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
