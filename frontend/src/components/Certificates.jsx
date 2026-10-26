import React from 'react';
import { Award, ExternalLink, Calendar, CheckCircle } from 'lucide-react';
import { getFileUrl } from '../services/api';

export const Certificates = ({ certificates = [] }) => {
  return (
    <section id="certificates" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/50">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Credentials</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Certificates & <span className="gradient-text">Achievements</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Professional certifications, online specializations, and academic milestones achieved.
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-2xl max-w-md mx-auto p-8">
            <Award className="w-12 h-12 mx-auto text-slate-500 mb-3" />
            <div className="text-lg font-semibold text-white">No certificates listed yet</div>
            <p className="text-sm text-slate-400 mt-1">Upload and manage certificates through the Tech Innovator Dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => {
              const imageSrc = cert.image_url ? getFileUrl(cert.image_url) : null;

              return (
                <div
                  key={cert.id}
                  className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col group"
                >
                  {/* Certificate preview image / banner */}
                  <div className="h-40 bg-gradient-to-tr from-navy-950 via-slate-900 to-indigo-950/60 relative overflow-hidden flex items-center justify-center border-b border-white/5">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-center p-4">
                        <Award className="w-12 h-12 mx-auto text-emerald-400/80 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                          Certified Credential
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-emerald-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold">{cert.issuer}</span>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                        {cert.title}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                      {cert.issue_date ? (
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{cert.issue_date}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">Verified</span>
                      )}

                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                        >
                          <span>Verify</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
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
