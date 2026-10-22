import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/comments/CommentSection';
import {
  MessageSquare,
  Sparkles,
  Flame,
  BookOpen,
  ArrowRight,
  Layers,
  Users,
} from 'lucide-react';

const DISCUSSION_TOPICS = [
  {
    id: 'crispr-future-medicine',
    title: 'CRISPR & Gene Editing Ethics in Restorative Medicine',
    category: 'Science',
    categoryColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    description: 'Discussing the boundary between somatic gene corrections and inherited germline modifications in clinical human trials.',
    author: 'Dr. Priya Mehta',
    authorRole: 'author',
  },
  {
    id: 'ai-reasoning-frontiers',
    title: 'Autonomous AI Agents and the Future of Software Development',
    category: 'Technology',
    categoryColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    description: 'How multi-agent systems and verified workflows are shifting software engineering from manual coding to specification architecture.',
    author: 'Thomas Okeke',
    authorRole: 'author',
  },
  {
    id: 'climate-resilience-2030',
    title: 'Rethinking Global Water Infrastructure for the Next Century',
    category: 'Environment',
    categoryColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    description: 'How coastal megacities and arid regions are deploying biomimetic sponge architecture to survive hydrologic extremes.',
    author: 'Thomas Okeke',
    authorRole: 'author',
  },
  {
    id: 'ancient-manuscripts-decoded',
    title: 'Unlocking the Lost Scrolls of Herculaneum with Computer Vision',
    category: 'History',
    categoryColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    description: 'High-energy X-ray phase contrast tomography is revealing philosophical texts preserved by volcanic ash for two millennia.',
    author: 'Thomas Okeke',
    authorRole: 'author',
  },
  {
    id: 'longevity-cellular-repair',
    title: 'The Molecular Hallmarks of Aging and Cellular Rejuvenation',
    category: 'Medicine',
    categoryColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    description: 'From senolytics to partial epigenetic reprogramming, how targeting cellular decay is transforming preventative healthcare.',
    author: 'Dr. Priya Mehta',
    authorRole: 'author',
  },
  {
    id: 'editorial-moderation-standards',
    title: 'Community Governance & Editorial Integrity in Modern CMS',
    category: 'Publishing',
    categoryColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    description: 'Developing transparent editorial review pipelines, reader feedback mechanisms, and automated fact-checking guardrails.',
    author: 'Eleanor Vance',
    authorRole: 'admin',
  },
];

const DiscussionPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTopic, setActiveTopic] = useState(DISCUSSION_TOPICS[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 rounded-full text-xs font-semibold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>ArticleFlow Editorial Forum & Discussion</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Open Discussions & Topic Reflections
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Engage with authors, researchers, and editorial moderators across all published essays and research domains.
          </p>
        </div>
      </div>

      {/* Topic Switcher Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Flame className="w-3.5 h-3.5 text-blue-500" />
            Select Discussion Topic ({DISCUSSION_TOPICS.length} Active Threads)
          </span>
          <span className="text-xs text-slate-400 font-mono">Click any thread to view</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DISCUSSION_TOPICS.map((topic) => {
            const isSelected = activeTopic.id === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopic(topic)}
                className={`p-5 rounded-2xl border text-left transition-all space-y-3 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white dark:bg-[#111827] border-blue-600 dark:border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'enterprise-card hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                }`}
              >
                <div className="space-y-2">
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-mono ${topic.categoryColor}`}
                  >
                    {topic.category}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {topic.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 w-full font-mono">
                  <span className="truncate max-w-[170px]">{topic.author}</span>
                  {isSelected ? (
                    <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      Active <ArrowRight className="w-3 h-3" />
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      Open <MessageSquare className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Thread Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 text-white p-6 sm:p-8 space-y-3 shadow-lg overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2 text-xs text-blue-300 font-mono uppercase tracking-wider font-semibold">
          <BookOpen className="w-4 h-4" />
          <span>Active Topic Discussion</span>
        </div>
        <h2 className="relative z-10 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {activeTopic.title}
        </h2>
        <p className="relative z-10 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          {activeTopic.description}
        </p>
        <div className="relative z-10 pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
          <span>Domain: <strong className="text-white">{activeTopic.category}</strong></span>
          <span>•</span>
          <span>Topic Lead: <strong className="text-white">{activeTopic.author}</strong></span>
        </div>
      </div>

      {/* Threaded Comment Section */}
      <CommentSection targetId={activeTopic.id} targetTitle={activeTopic.title} />
    </div>
  );
};

export default DiscussionPage;
