import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  ExternalLink, 
  Calendar,
  X 
} from 'lucide-react';
import { api, getFileUrl } from '../../services/api';
import { useToast } from '../../components/Toast';
import { Modal } from '../../components/Modal';

export const CertificatesManager = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issue_date: '',
    credential_url: '',
    image_url: ''
  });

  const { success, error } = useToast();

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getCertificates();
      setCertificates(res.certificates || []);
    } catch (err) {
      error(err.message || "Failed to load certificates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const openAddModal = () => {
    setEditingCert(null);
    setFormData({
      title: '',
      issuer: '',
      issue_date: '',
      credential_url: '',
      image_url: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cert) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      issue_date: cert.issue_date || '',
      credential_url: cert.credential_url || '',
      image_url: cert.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const res = await api.admin.uploadImage(file);
      setFormData((prev) => ({ ...prev, image_url: res.url }));
      success("Certificate image uploaded!");
    } catch (err) {
      error(err.message || "Failed to upload image.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.issuer.trim()) {
      error("Title and Issuer are required.");
      return;
    }

    try {
      setSubmitting(true);
      if (editingCert) {
        await api.admin.updateCertificate(editingCert.id, formData);
        success("Certificate updated successfully!");
      } else {
        await api.admin.createCertificate(formData);
        success("Certificate added successfully!");
      }
      setIsModalOpen(false);
      fetchCertificates();
    } catch (err) {
      error(err.message || "Failed to save certificate.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.admin.deleteCertificate(id);
      success("Certificate deleted successfully.");
      setDeleteConfirmId(null);
      fetchCertificates();
    } catch (err) {
      error(err.message || "Failed to delete certificate.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Certificates & <span className="gradient-text">Achievements</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Showcase verified badges, credentials, and achievements.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 transition-all shadow-md shadow-emerald-600/30 min-h-[40px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-violet-500/20 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border border-white/10 p-8">
          <Award className="w-12 h-12 mx-auto text-slate-500 mb-3" />
          <div className="text-base font-semibold text-white">No certificates added yet</div>
          <p className="text-xs text-slate-400 mt-1">Add your credentials and proof of achievements.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="glass-card rounded-2xl border border-white/10 flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Image Banner */}
                <div className="h-32 bg-gradient-to-tr from-navy-950 to-slate-900 relative overflow-hidden flex items-center justify-center border-b border-white/5">
                  {cert.image_url ? (
                    <img
                      src={getFileUrl(cert.image_url)}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-center text-slate-500 text-xs">
                      <Award className="w-8 h-8 mx-auto text-cyan-400/50 mb-1" />
                      <span>Certificate Badge</span>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-2">
                  <div className="text-xs text-cyan-300 font-semibold">{cert.issuer}</div>
                  <h3 className="font-bold text-white text-base leading-snug line-clamp-2">
                    {cert.title}
                  </h3>
                  {cert.issue_date && (
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{cert.issue_date}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(cert)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {deleteConfirmId === cert.id ? (
                    <div className="flex items-center gap-1 bg-rose-950/80 p-1 rounded-lg border border-rose-500/40">
                      <button
                        onClick={() => handleDelete(cert.id)}
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
                      onClick={() => setDeleteConfirmId(cert.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    <span>Verify</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Certificate Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCert ? 'Edit Certificate' : 'Add New Certificate'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Certificate Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Deep Learning Specialization"
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Issuing Organization <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                placeholder="e.g. Coursera / Stanford / NPTEL"
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Issue Date / Year
              </label>
              <input
                type="text"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                placeholder="e.g. May 2024"
                className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Credential Verification URL
            </label>
            <input
              type="url"
              value={formData.credential_url}
              onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
              placeholder="https://coursera.org/verify/..."
              className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
            />
          </div>

          {/* Certificate Image Upload */}
          <div className="pt-2 border-t border-white/10 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Certificate Image / Badge
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 cursor-pointer border border-white/10">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Certificate Image</span>
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
                  <span>Uploading...</span>
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
              {submitting ? 'Saving...' : editingCert ? 'Update' : 'Add Certificate'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
