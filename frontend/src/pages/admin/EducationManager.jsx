import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Edit3, 
  Trash2, 
  Building2, 
  Calendar, 
  Award,
  X 
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../components/Toast';
import { Modal } from '../../components/Modal';

export const EducationManager = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    field_of_study: '',
    start_year: '',
    end_year: '',
    grade: '',
    description: '',
    display_order: 1
  });

  const { success, error } = useToast();

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getEducation();
      setEducation(res.education || []);
    } catch (err) {
      error(err.message || "Failed to load education history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const openAddModal = () => {
    setEditingEdu(null);
    setFormData({
      degree: '',
      institution: '',
      field_of_study: '',
      start_year: '',
      end_year: 'Present',
      grade: '',
      description: '',
      display_order: education.length + 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (edu) => {
    setEditingEdu(edu);
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      field_of_study: edu.field_of_study || '',
      start_year: edu.start_year || '',
      end_year: edu.end_year || '',
      grade: edu.grade || '',
      description: edu.description || '',
      display_order: edu.display_order || 1
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.degree.trim() || !formData.institution.trim()) {
      error("Degree and Institution name are required.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingEdu) {
        await api.admin.updateEducation(editingEdu.id, formData);
        success("Education updated successfully!");
      } else {
        await api.admin.createEducation(formData);
        success("Education added successfully!");
      }
      setIsModalOpen(false);
      fetchEducation();
    } catch (err) {
      error(err.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.admin.deleteEducation(id);
      success("Education record deleted.");
      setDeleteConfirmId(null);
      fetchEducation();
    } catch (err) {
      error(err.message || "Failed to delete record.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Education <span className="gradient-text">Records</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Display your M.Sc. Data Science program and past degrees.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 transition-all shadow-md shadow-emerald-600/30 min-h-[40px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
      </div>

      {/* Education List */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-violet-500/20 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      ) : education.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border border-white/10 p-8">
          <GraduationCap className="w-12 h-12 mx-auto text-slate-500 mb-3" />
          <div className="text-base font-semibold text-white">No education records found</div>
          <p className="text-xs text-slate-400 mt-1">Add your degree programs and colleges.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((item) => (
            <div
              key={item.id}
              className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-600/20 text-cyan-300 border border-violet-500/30 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.start_year || '—'} - {item.end_year || 'Present'}</span>
                  </span>
                  {item.grade && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>{item.grade}</span>
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500">
                    Order: #{item.display_order}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white">
                  {item.degree}
                </h3>

                <div className="text-xs sm:text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span>{item.institution}</span>
                  {item.field_of_study && <span>• {item.field_of_study}</span>}
                </div>

                {item.description && (
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 shrink-0">
                <button
                  onClick={() => openEditModal(item)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white glass-panel hover:bg-white/10"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {deleteConfirmId === item.id ? (
                  <div className="flex items-center gap-1 bg-rose-950/80 p-1 rounded-lg border border-rose-500/40">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-2 py-0.5 rounded text-[10px] font-bold text-rose-300"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Education Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEdu ? 'Edit Education Record' : 'Add Education Record'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Degree / Qualification <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="e.g. Master of Science (M.Sc.)"
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Field of Study
              </label>
              <input
                type="text"
                value={formData.field_of_study}
                onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                placeholder="e.g. Data Science"
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Institution / University <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="e.g. University / Department Name"
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Start Year
              </label>
              <input
                type="text"
                value={formData.start_year}
                onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                placeholder="e.g. 2024"
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                End Year
              </label>
              <input
                type="text"
                value={formData.end_year}
                onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                placeholder="e.g. Present (2026)"
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Grade / CGPA
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                placeholder="e.g. First Class / Distinction"
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description / Academic Highlights
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe key subjects, coursework, research, or academic distinctions..."
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Display Order Priority (Lower = higher in list)
            </label>
            <input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              className="w-32 px-3.5 py-2 text-xs rounded-xl glass-input text-white"
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
              {submitting ? 'Saving...' : editingEdu ? 'Update' : 'Add Record'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
