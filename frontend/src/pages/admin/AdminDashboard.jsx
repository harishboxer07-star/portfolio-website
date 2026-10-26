import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderGit2, 
  Cpu, 
  GraduationCap, 
  Award, 
  Mail, 
  ArrowUpRight, 
  Plus, 
  User, 
  CheckCircle, 
  Clock 
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../components/Toast';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_projects: 0,
    total_skills: 0,
    total_education: 0,
    total_certificates: 0,
    total_messages: 0,
    unread_messages: 0,
    recent_messages: []
  });
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getStats();
      setStats(data);
    } catch (err) {
      error(err.message || "Failed to load dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Projects',
      count: stats.total_projects,
      path: '/admin/projects',
      icon: FolderGit2,
      color: 'from-emerald-600 to-teal-600',
      badgeColor: 'text-emerald-300 bg-emerald-950/60'
    },
    {
      title: 'Skills Matrix',
      count: stats.total_skills,
      path: '/admin/skills',
      icon: Cpu,
      color: 'from-cyan-600 to-teal-600',
      badgeColor: 'text-cyan-300 bg-cyan-950/60'
    },
    {
      title: 'Certificates',
      count: stats.total_certificates,
      path: '/admin/certificates',
      icon: Award,
      color: 'from-teal-600 to-emerald-600',
      badgeColor: 'text-teal-300 bg-teal-950/60'
    },
    {
      title: 'Education Records',
      count: stats.total_education,
      path: '/admin/education',
      icon: GraduationCap,
      color: 'from-emerald-700 to-cyan-600',
      badgeColor: 'text-emerald-300 bg-emerald-950/60'
    },
    {
      title: 'Contact Messages',
      count: stats.total_messages,
      unread: stats.unread_messages,
      path: '/admin/messages',
      icon: Mail,
      color: 'from-rose-600 to-pink-600',
      badgeColor: 'text-rose-300 bg-rose-950/60'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Dashboard <span className="gradient-text">Overview</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time status of Harish Kumar's portfolio database and incoming inquiries.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/projects"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 transition-all shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </Link>
          <Link
            to="/admin/profile"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 glass-panel border border-white/10 hover:border-cyan-400/40 hover:text-white transition-all"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Edit Profile</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.path}
              className="glass-card p-5 rounded-2xl border border-white/10 hover:border-brand-purple/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {card.count}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{card.title}</div>
              </div>

              {card.unread !== undefined && card.unread > 0 && (
                <div className="mt-3 pt-2 border-t border-white/5">
                  <span className="text-[11px] font-semibold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-800/40">
                    {card.unread} unread
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Messages & Content Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Messages Card */}
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">Recent Contact Submissions</h3>
            </div>
            <Link
              to="/admin/messages"
              className="text-xs text-cyan-300 hover:text-cyan-200 font-semibold"
            >
              View All ({stats.total_messages}) &rarr;
            </Link>
          </div>

          {stats.recent_messages.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No messages received yet. Messages submitted via the public contact form will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recent_messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    msg.is_read
                      ? 'bg-white/5 border-white/5 text-slate-400'
                      : 'bg-indigo-950/40 border-indigo-500/30 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">{msg.name}</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs text-cyan-300 font-mono mb-1">{msg.email}</div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Management Checklist */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-sm pb-3 border-b border-white/10 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-brand-purple" />
            <span>Quick Management Center</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <Link
              to="/admin/profile"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
            >
              <div>
                <div className="font-semibold text-white">Update Bio & Profile Photo</div>
                <div className="text-[11px] text-slate-400">Replace photo, change resume PDF, phone</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/admin/projects"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
            >
              <div>
                <div className="font-semibold text-white">Manage Project Showcase</div>
                <div className="text-[11px] text-slate-400">Add, edit, or delete machine learning projects</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/admin/skills"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
            >
              <div>
                <div className="font-semibold text-white">Customize Skills Matrix</div>
                <div className="text-[11px] text-slate-400">Adjust percentages and categories</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </Link>

            <Link
              to="/admin/education"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
            >
              <div>
                <div className="font-semibold text-white">Academic Qualifications</div>
                <div className="text-[11px] text-slate-400">M.Sc. Data Science and university records</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
