import React, { useState, useEffect, useMemo } from 'react';
import { 
  FolderGit2, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Upload, 
  ExternalLink, 
  Github, 
  Sparkles,
  Check,
  X,
  Tag,
  Globe
} from 'lucide-react';
import { api, getFileUrl } from '../../services/api';
import { useToast } from '../../components/Toast';
import { Modal } from '../../components/Modal';

const DEFAULT_DOMAINS = [
  'Data Science',
  'Machine Learning',
  'Full-Stack Web',
  'Deep Learning',
  'Analytics & BI',
  'Cloud Computing',
  'Cybersecurity',
  'General'
];

const formatUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  
  // Custom domain addition state
  const [customDomains, setCustomDomains] = useState([]);
  const [isAddingCustomDomain, setIsAddingCustomDomain] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  
  // Delete confirm state
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    tech_stack: '',
    github_url: '',
    live_demo_url: '',
    category: 'Data Science',
    is_featured: false
  });

  const { success, error } = useToast();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getProjects();
      setProjects(res.projects || []);
    } catch (err) {
      error(err.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Compute all available domains for dropdown
  const availableDomains = useMemo(() => {
    const set = new Set(DEFAULT_DOMAINS);
    customDomains.forEach((d) => {
      if (d && d.trim()) set.add(d.trim());
    });
    projects.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    if (formData.category && formData.category.trim()) {
      set.add(formData.category.trim());
    }
    return Array.from(set);
  }, [projects, customDomains, formData.category]);

  // Compute unique domains in projects for list filter pills
  const projectDomainsForFilter = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return Array.from(set);
  }, [projects]);

  const openAddModal = () => {
    setEditingProject(null);
    setIsAddingCustomDomain(false);
    setNewDomainInput('');
    setFormData({
      title: '',
      description: '',
      image_url: '',
      tech_stack: '',
      github_url: '',
      live_demo_url: '',
      category: availableDomains[0] || 'Data Science',
      is_featured: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setIsAddingCustomDomain(false);
    setNewDomainInput('');
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url || '',
      tech_stack: project.raw_tech_stack || (project.tech_stack || []).join(', '),
      github_url: project.github_url || '',
      live_demo_url: project.live_demo_url || '',
      category: project.category || 'Data Science',
      is_featured: !!project.is_featured
    });
    setIsModalOpen(true);
  };

  const handleAddCustomDomain = () => {
    const trimmed = newDomainInput.trim();
    if (!trimmed) {
      error("Please enter a domain name.");
      return;
    }
    if (!customDomains.includes(trimmed)) {
      setCustomDomains((prev) => [...prev, trimmed]);
    }
    setFormData((prev) => ({ ...prev, category: trimmed }));
    setNewDomainInput('');
    setIsAddingCustomDomain(false);
    success(`Domain "${trimmed}" added and selected!`);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const res = await api.admin.uploadImage(file);
      setFormData((prev) => ({ ...prev, image_url: res.url }));
      success("Project image uploaded successfully!");
    } catch (err) {
      error(err.message || "Failed to upload project image.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      error("Title and description are required.");
      return;
    }

    let categoryToSave = (formData.category || '').trim();
    if (isAddingCustomDomain && newDomainInput.trim()) {
      categoryToSave = newDomainInput.trim();
      if (!customDomains.includes(categoryToSave)) {
        setCustomDomains((prev) => [...prev, categoryToSave]);
      }
    }
    if (!categoryToSave) categoryToSave = 'General';

    const payload = {
      ...formData,
      category: categoryToSave,
      github_url: formatUrl(formData.github_url),
      live_demo_url: formatUrl(formData.live_demo_url)
    };

    try {
      setSubmitting(true);
      if (editingProject) {
        await api.admin.updateProject(editingProject.id, payload);
        success("Project updated successfully!");
      } else {
        await api.admin.createProject(payload);
        success("Project added successfully!");
      }
      setIsModalOpen(false);
      setIsAddingCustomDomain(false);
      setNewDomainInput('');
      fetchProjects();
    } catch (err) {
      error(err.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.admin.deleteProject(id);
      success("Project deleted successfully.");
      setDeleteConfirmId(null);
      fetchProjects();
    } catch (err) {
      error(err.message || "Failed to delete project.");
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesDomain =
      selectedDomain === 'All' ||
      p.category?.toLowerCase() === selectedDomain.toLowerCase();

    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      p.title.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      (p.category && p.category.toLowerCase().includes(term)) ||
      (p.tech_stack && p.tech_stack.some((t) => t.toLowerCase().includes(term)));

    return matchesDomain && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Projects <span className="gradient-text">Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, edit, upload screenshots, or delete portfolio projects.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 transition-all shadow-md shadow-emerald-600/30 min-h-[40px]"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Domain / Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setSelectedDomain('All')}
          className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedDomain === 'All'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
              : 'glass-panel text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
          }`}
        >
          All Domains ({projects.length})
        </button>

        {projectDomainsForFilter.map((domain) => {
          const count = projects.filter((p) => p.category?.toLowerCase() === domain.toLowerCase()).length;
          return (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDomain === domain
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                  : 'glass-panel text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
              }`}
            >
              {domain} ({count})
            </button>
          );
        })}
      </div>

      {/* Search and count bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title, domain, or tech..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input text-white placeholder-slate-400 focus:outline-none"
          />
        </div>
        <div className="text-xs text-slate-400">
          Showing <span className="font-bold text-white">{filteredProjects.length}</span> projects
        </div>
      </div>

      {/* Projects Grid / List */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-violet-500/20 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border border-white/10 p-8">
          <FolderGit2 className="w-12 h-12 mx-auto text-slate-500 mb-3" />
          <div className="text-base font-semibold text-white">No projects found</div>
          <p className="text-xs text-slate-400 mt-1">Click "New Project" to add your first work.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-2xl border border-white/10 flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Image Banner */}
                <div className="h-36 bg-gradient-to-tr from-slate-900 to-navy-900 relative overflow-hidden flex items-center justify-center border-b border-white/5">
                  {project.image_url ? (
                    <img
                      src={getFileUrl(project.image_url)}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-center text-slate-500 text-xs flex flex-col items-center">
                      <FolderGit2 className="w-8 h-8 text-indigo-400/50 mb-1" />
                      <span>No image uploaded</span>
                    </div>
                  )}

                  <div className="absolute top-2.5 left-2.5">
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-navy-950/90 text-cyan-300 border border-cyan-500/30 shadow-sm backdrop-blur-md">
                      <Tag className="w-2.5 h-2.5 text-cyan-400" />
                      <span>{project.category || 'General'}</span>
                    </span>
                  </div>

                  {project.is_featured && (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-600/90 text-white shadow-sm shadow-emerald-600/40">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Featured</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-white text-base leading-snug line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.tech_stack?.slice(0, 4).map((tech, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack?.length > 4 && (
                      <span className="text-[10px] px-1.5 py-0.5 text-slate-500">
                        +{project.tech_stack.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit Project"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {deleteConfirmId === project.id ? (
                    <div className="flex items-center gap-1 bg-rose-950/80 p-1 rounded-lg border border-rose-500/40">
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-2 py-0.5 rounded text-[10px] font-bold text-rose-300 hover:bg-rose-900/60"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="p-1 rounded text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirmId(project.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-white"
                      title="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.live_demo_url && (
                    <a
                      href={project.live_demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Project Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Predictive Customer Churn Pipeline"
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Project Domain / Category <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingCustomDomain(!isAddingCustomDomain)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isAddingCustomDomain ? 'Select from list' : 'Add New Domain'}</span>
                </button>
              </div>

              {!isAddingCustomDomain ? (
                <div>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      if (e.target.value === '__ADD_NEW__') {
                        setIsAddingCustomDomain(true);
                      } else {
                        setFormData({ ...formData, category: e.target.value });
                      }
                    }}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white bg-slate-900 border border-white/10 focus:border-cyan-400"
                  >
                    {availableDomains.map((dom) => (
                      <option key={dom} value={dom}>
                        {dom}
                      </option>
                    ))}
                    <option value="__ADD_NEW__" className="text-cyan-400 font-semibold bg-slate-800">
                      + Add New Domain to list...
                    </option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="e.g. Artificial Intelligence, IoT..."
                      value={newDomainInput}
                      onChange={(e) => setNewDomainInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomDomain();
                        }
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-xl glass-input text-white placeholder-slate-500 border border-cyan-500/50 focus:border-cyan-400"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomDomain}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors shrink-0"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCustomDomain(false);
                        setNewDomainInput('');
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Type a new domain and click <span className="text-cyan-300 font-medium">Add</span> to add it to the list.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Featured Status
              </label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded bg-slate-900 border-white/20 text-brand-purple focus:ring-brand-purple"
                />
                <span className="text-xs text-slate-300">Feature this project prominently</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the problem, data methodology, model algorithms, architecture, and outcomes..."
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Technologies (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tech_stack}
              onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
              placeholder="e.g. Python, Scikit-Learn, Pandas, React, Flask, SQLite"
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                GitHub Repository URL
              </label>
              <input
                type="text"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Live Demo / Deployment URL
              </label>
              <input
                type="text"
                value={formData.live_demo_url}
                onChange={(e) => setFormData({ ...formData, live_demo_url: e.target.value })}
                placeholder="https://... or yourdomain.com"
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
              />
            </div>
          </div>

          {/* Screenshot / Image Upload */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Project Screenshot / Cover Image
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 cursor-pointer border border-white/10">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Screenshot</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {imageUploading && (
                <div className="text-xs text-cyan-300 flex items-center gap-1.5 animate-pulse">
                  <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span>Uploading image...</span>
                </div>
              )}
            </div>
            {formData.image_url && (
              <div className="text-[11px] text-slate-400 truncate">
                Attached: <span className="text-cyan-300">{formData.image_url}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 transition-all shadow-md shadow-emerald-600/30 disabled:opacity-50 min-h-[40px]"
            >
              {submitting ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
