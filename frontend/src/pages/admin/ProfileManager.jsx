import React, { useState, useEffect } from 'react';
import { 
  User, 
  Save, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Phone, 
  Mail, 
  MapPin, 
  Github, 
  Linkedin, 
  Sparkles,
  Download
} from 'lucide-react';
import { api, getFileUrl } from '../../services/api';
import { useToast } from '../../components/Toast';
import defaultPhoto from '../../assets/harish_kumar.jpg';

export const ProfileManager = () => {
  const [formData, setFormData] = useState({
    full_name: 'Harish Kumar',
    qualification: 'M.Sc. Data Science',
    role: 'Data Science Student | Aspiring Full-Stack Developer',
    mobile: '6380178269',
    email: '',
    location: '',
    bio: '',
    github_url: '',
    linkedin_url: '',
    photo_url: '',
    resume_url: '',
    career_interests: '',
    professional_goals: '',
    personal_strengths: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);

  const { success, error } = useToast();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.admin.getProfile();
      if (res.profile) {
        setFormData(res.profile);
      }
    } catch (err) {
      error(err.message || "Failed to load profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.admin.updateProfile(formData);
      success(res.message || "Profile updated successfully! Live website updated.");
      setFormData(res.profile);
    } catch (err) {
      error(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setPhotoUploading(true);
      const res = await api.admin.uploadImage(file);
      setFormData((prev) => ({ ...prev, photo_url: res.url }));
      success("Profile photo uploaded! Don't forget to click Save Profile.");
    } catch (err) {
      error(err.message || "Failed to upload photo. Only JPEG, PNG, WEBP allowed.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setResumeUploading(true);
      const res = await api.admin.uploadResume(file);
      setFormData((prev) => ({ ...prev, resume_url: res.url }));
      success("Resume PDF uploaded! Don't forget to click Save Profile.");
    } catch (err) {
      error(err.message || "Failed to upload resume. Only PDF files allowed.");
    } finally {
      setResumeUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  const currentPhoto = formData.photo_url ? getFileUrl(formData.photo_url) : defaultPhoto;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Profile & <span className="gradient-text">Biography</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Update personal bio, contact details, profile photograph, and downloadable resume.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 transition-all shadow-md shadow-emerald-600/30 disabled:opacity-50 min-h-[42px]"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Photos & Files */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Photograph Upload Box */}
          <div className="glass-card p-6 rounded-2xl border border-white/10 text-center space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Profile Photograph</span>
            </h3>

            <div className="relative mx-auto w-40 h-48 rounded-2xl overflow-hidden glass-panel border border-white/20 shadow-xl group">
              <img
                src={currentPhoto}
                alt="Harish Kumar preview"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultPhoto;
                }}
              />
              {photoUploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 cursor-pointer border border-white/10 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Photograph</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-400">
                Recommended: clear portrait photo (JPG, PNG, or WEBP up to 16MB).
              </p>
            </div>
          </div>

          {/* Resume PDF Upload Box */}
          <div className="glass-card p-6 rounded-2xl border border-white/10 text-center space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Resume PDF</span>
            </h3>

            {formData.resume_url ? (
              <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-800/40 flex items-center justify-between text-left">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span className="text-xs text-slate-200 truncate">
                    {formData.resume_url.split('/').pop()}
                  </span>
                </div>
                <a
                  href={getFileUrl(formData.resume_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-white/10 text-white hover:text-cyan-300"
                  title="View PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic">
                No resume uploaded yet. Visitors will see the contact button.
              </div>
            )}

            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-white/10 hover:bg-white/15 cursor-pointer border border-white/10 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{formData.resume_url ? 'Replace Resume PDF' : 'Upload Resume PDF'}</span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-400">
                Only PDF documents are allowed.
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: Editable Profile Fields */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Identity & Basic Info */}
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-purple" />
              <span>Identity & Primary Contact</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hero Role / Subtitle
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Number (Calling & WhatsApp)
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. harish.datascience@gmail.com"
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Location / City
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Chennai, Tamil Nadu, India"
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
                />
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Social Links</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  name="github_url"
                  value={formData.github_url}
                  onChange={handleChange}
                  placeholder="https://github.com/your-username"
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/your-profile"
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
                />
              </div>
            </div>
          </div>

          {/* Narrative & Biography */}
          <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Biography & Professional Focus</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Professional Biography
                </label>
                <textarea
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write your professional summary, academic passions, and technical philosophy..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Career Interests
                </label>
                <textarea
                  name="career_interests"
                  rows="2"
                  value={formData.career_interests}
                  onChange={handleChange}
                  placeholder="e.g. Machine Learning, Deep Learning, Predictive Analytics..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Professional Goals
                </label>
                <textarea
                  name="professional_goals"
                  rows="2"
                  value={formData.professional_goals}
                  onChange={handleChange}
                  placeholder="e.g. Build impactful data products and scalable intelligent applications..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Personal Strengths
                </label>
                <textarea
                  name="personal_strengths"
                  rows="2"
                  value={formData.personal_strengths}
                  onChange={handleChange}
                  placeholder="e.g. Analytical thinking, swift adaptation to modern frameworks..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input text-white"
                />
              </div>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
};
