import React from 'react';
import { Layers, Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#0B0F19]/80 backdrop-blur-md py-6 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-tight">ArticleFlow</span>
            <span className="hidden md:inline text-slate-400 dark:text-slate-500">•</span>
            <span className="hidden md:inline font-medium text-slate-600 dark:text-slate-400">Enterprise Content Intelligence & Analytics</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Operational v2.4</span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              &copy; {new Date().getFullYear()} ArticleFlow Inc. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

