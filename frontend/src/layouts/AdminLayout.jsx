import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  FolderGit2, 
  Cpu, 
  GraduationCap, 
  Award, 
  Mail, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    success("Logged out successfully.");
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Profile & Bio', path: '/admin/profile', icon: User },
    { name: 'Projects Manager', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Skills Matrix', path: '/admin/skills', icon: Cpu },
    { name: 'Education Records', path: '/admin/education', icon: GraduationCap },
    { name: 'Certificates', path: '/admin/certificates', icon: Award },
    { name: 'Messages Inbox', path: '/admin/messages', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Navbar */}
      <div className="md:hidden glass-panel border-b border-white/10 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center font-bold text-white text-xs">
            HK
          </div>
          <span className="font-bold text-sm text-white">Tech Innovator Dashboard</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg glass-panel text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-40 w-64 glass-panel border-r border-white/10 flex flex-col justify-between transition-transform duration-300 h-screen overflow-y-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          {/* Brand & User identity */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-cyan flex items-center justify-center font-bold text-white shadow-md shadow-brand-purple/20">
              HK
            </div>
            <div>
              <div className="font-bold text-sm text-white leading-tight">Harish Kumar</div>
              <div className="text-[11px] text-cyan-300">Tech Innovator Control Center</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all min-h-[42px] ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </span>
            <span className="text-[10px] text-slate-500">Live</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 min-h-screen p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};
