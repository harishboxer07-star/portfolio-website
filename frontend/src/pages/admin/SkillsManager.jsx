import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Layers, 
  X, 
  Check 
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../components/Toast';
import { Modal } from '../../components/Modal';

const CATEGORIES = [
  'Programming Languages',
  'Data Science and Machine Learning',
  'Frontend Development',
  'Backend Development',
  'Databases',
  'Tools and Technologies'
];

export const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Delete confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming Languages',
    proficiency_level: 80
  });

  const { success, error } = useToast();

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getSkills();
      setSkills(res.skills || []);
    } catch (err) {
      error(err.message || "Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: selectedCategory !== 'All' ? selectedCategory : 'Programming Languages',
      proficiency_level: 80
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency_level: skill.proficiency_level
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error("Skill name is required.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingSkill) {
        await api.admin.updateSkill(editingSkill.id, formData);
        success("Skill updated successfully!");
      } else {
        await api.admin.createSkill(formData);
        success("Skill added successfully!");
      }
      setIsModalOpen(false);
      fetchSkills();
    } catch (err) {
      error(err.message || "Failed to save skill.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.admin.deleteSkill(id);
      success("Skill deleted successfully.");
      setDeleteConfirmId(null);
      fetchSkills();
    } catch (err) {
      error(err.message || "Failed to delete skill.");
    }
  };

  const filteredSkills = skills.filter((s) => {
    return selectedCategory === 'All' || s.category === selectedCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Skills <span className="gradient-text">Matrix</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your categorized technical capabilities and proficiency percentages.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 transition-all shadow-md shadow-emerald-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap pb-2 sm:pb-0">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedCategory === 'All'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
              : 'glass-panel text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          All ({skills.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = skills.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                  : 'glass-panel text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Skills Table / Cards */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border border-white/10 p-8">
          <Cpu className="w-12 h-12 mx-auto text-slate-500 mb-3" />
          <div className="text-base font-semibold text-white">No skills in this category</div>
          <p className="text-xs text-slate-400 mt-1">Click "Add Skill" to record a new capability.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="glass-card p-4 rounded-xl border border-white/10 flex items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white truncate">{skill.name}</span>
                  <span className="text-emerald-400 font-semibold">{skill.proficiency_level}%</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">{skill.category}</div>
                
                {/* Visual bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400"
                    style={{ width: `${skill.proficiency_level}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => openEditModal(skill)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                  title="Edit Skill"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {deleteConfirmId === skill.id ? (
                  <div className="flex items-center gap-1 bg-rose-950/80 p-1 rounded-lg border border-rose-500/40">
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold text-rose-300"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="p-0.5 text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(skill.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30"
                    title="Delete Skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Skill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Skill Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Scikit-Learn, React.js, SQL"
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white bg-slate-900"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Proficiency Level
              </label>
              <span className="text-xs font-bold text-cyan-400">
                {formData.proficiency_level}%
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={formData.proficiency_level}
              onChange={(e) => setFormData({ ...formData, proficiency_level: parseInt(e.target.value) })}
              className="w-full accent-cyan-400 cursor-pointer"
            />
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
              {submitting ? 'Saving...' : editingSkill ? 'Update' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
