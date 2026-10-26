import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Projects } from '../components/Projects';
import { Education } from '../components/Education';
import { Certificates } from '../components/Certificates';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';

export const PublicPortfolio = () => {
  const [data, setData] = useState({
    profile: null,
    projects: [],
    skills: [],
    skills_by_category: {},
    education: [],
    certificates: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.public.getPortfolio();
      setData({
        profile: res.profile,
        projects: res.projects || [],
        skills: res.skills || [],
        skills_by_category: res.skills_by_category || {},
        education: res.education || [],
        certificates: res.certificates || []
      });
    } catch (err) {
      console.error("Error loading portfolio bundle:", err);
      setError(err.message || "Failed to load portfolio details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-emerald-300">
            HK
          </div>
        </div>
        <div className="mt-4 text-sm font-semibold text-slate-300 tracking-wide animate-pulse">
          Loading Harish Kumar's Portfolio...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="glass-card max-w-md p-8 rounded-2xl border-rose-500/30">
          <div className="text-rose-400 font-bold text-lg mb-2">Connection Issue</div>
          <p className="text-sm text-slate-300 mb-6">{error}</p>
          <button
            onClick={fetchPortfolio}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-600/30 hover:scale-105 transition-transform"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
      <Navbar profile={data.profile} />

      <main className="flex-1">
        <Hero profile={data.profile} />
        <About profile={data.profile} education={data.education} />
        <Skills
          skillsByCategory={data.skills_by_category}
          allSkills={data.skills}
        />
        <Projects projects={data.projects} />
        <Education education={data.education} />
        <Certificates certificates={data.certificates} />
        <Contact profile={data.profile} />
      </main>

      <Footer profile={data.profile} />
    </div>
  );
};
