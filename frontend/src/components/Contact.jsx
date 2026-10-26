import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from './Toast';

export const Contact = ({ profile }) => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const mobileNumber = profile?.mobile || '6380178269';
  const whatsappUrl = `https://wa.me/91${mobileNumber.replace(/[^0-9]/g, '')}`;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      error("Please fill in all fields before submitting.");
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await api.public.submitContact(formData);
      success(res.message || "Message sent successfully!");
      setStatusMessage({ type: 'success', text: "Your message has been delivered to Harish. Thank you!" });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      error(err.message || "Failed to send message. Please try again.");
      setStatusMessage({ type: 'error', text: err.message || "Failed to send message." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-navy-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Let's <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Have an opportunity, data science project, or want to collaborate? Send a message directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start max-w-5xl mx-auto">
          
          {/* Left: Contact Info & Quick Reach */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Phone Card */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-start gap-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-medium">Direct Phone / Call</div>
                <div className="text-base font-bold text-white tracking-wide">
                  +91 {mobileNumber}
                </div>
                <a
                  href={`tel:${mobileNumber}`}
                  className="inline-block text-xs text-emerald-400 hover:text-emerald-300 font-semibold pt-1"
                >
                  Call Now &rarr;
                </a>
              </div>
            </div>

            {/* WhatsApp Quick Link */}
            <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-start gap-4 bg-gradient-to-br from-emerald-950/30 to-slate-900/60">
              <div className="p-3.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-medium">WhatsApp Chat</div>
                <div className="text-sm font-semibold text-white">
                  Instant Messaging Available
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold pt-1"
                >
                  <span>Chat on WhatsApp</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>

            {/* Email (when configured) */}
            {profile?.email && (
              <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-slate-400 font-medium">Email Address</div>
                  <div className="text-sm font-bold text-white break-all">
                    {profile.email}
                  </div>
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-block text-xs text-indigo-400 hover:text-indigo-300 font-semibold pt-1"
                  >
                    Send Email &rarr;
                  </a>
                </div>
              </div>
            )}

            {/* Location (when configured) */}
            {profile?.location && (
              <div className="glass-card p-6 rounded-2xl border border-white/10 flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-slate-400 font-medium">Location</div>
                  <div className="text-sm font-bold text-white">
                    {profile.location}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Send a Direct Message</h3>
              <p className="text-xs text-slate-400 mb-6">
                Your message is stored securely and directly accessible by Harish.
              </p>

              {statusMessage && (
                <div
                  className={`p-4 rounded-xl text-xs sm:text-sm font-medium mb-6 flex items-start gap-2.5 ${
                    statusMessage.type === 'success'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {statusMessage.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-4 py-3 sm:py-2.5 text-base sm:text-sm rounded-xl glass-input text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Email Address <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. alex@example.com"
                    className="w-full px-4 py-3 sm:py-2.5 text-base sm:text-sm rounded-xl glass-input text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message, opportunity details, or inquiry here..."
                    className="w-full px-4 py-3 sm:py-2.5 text-base sm:text-sm rounded-xl glass-input text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full min-h-[48px] flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
