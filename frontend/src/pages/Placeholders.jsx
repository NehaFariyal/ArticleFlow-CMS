import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  LayoutGrid,
  Search,
  PenLine,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle2,
  Filter,
  Eye,
  Clock,
  ThumbsUp,
  TrendingUp,
  Layers,
  Activity,
  Cpu,
  ShieldAlert,
  Compass,
} from 'lucide-react';

/**
 * Home Page View - Enterprise Intelligence & Analytics Portal
 */
export const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-[#111827] dark:to-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 p-8 sm:p-14 shadow-card overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Next-Generation Editorial Analytics & Content Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Where Enterprise Knowledge Meets Real-Time Intelligence
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mx-auto">
            ArticleFlow empowers content architects, researchers, and editorial review teams with 
            deep peer verification, automated AI moderation, and interactive topic analytics.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                >
                  <span>Go to My Profile ({user?.role})</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/browse"
                  className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-blue-500" />
                  <span>Explore Articles</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/login"
                  className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 transition"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Telemetry KPI Band */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="enterprise-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider font-mono text-[10px]">VERIFICATION SLA</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            99.8%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Automated & peer reviewed
          </div>
        </div>

        <div className="enterprise-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider font-mono text-[10px]">TOPIC CLUSTERS</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            10+ Tracks
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Science, Tech, Health & Systems
          </div>
        </div>

        <div className="enterprise-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider font-mono text-[10px]">AI MODERATION</span>
            <Cpu className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Real-Time
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Multi-signal risk scanning
          </div>
        </div>

        <div className="enterprise-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold uppercase tracking-wider font-mono text-[10px]">GOVERNANCE</span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            RBAC Ready
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Author, Reader & Admin Roles
          </div>
        </div>
      </div>

      {/* Platform Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="enterprise-card enterprise-card-interactive p-7 space-y-4">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Curated Research & Deep-Dives
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            In-depth engineering notes, peer-reviewed science essays, and investigative analyses
            authored by verified domain contributors.
          </p>
        </div>

        <div className="enterprise-card enterprise-card-interactive p-7 space-y-4">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <PenLine className="w-5 h-5" />
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Interactive Knowledge Verification
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Reinforce key takeaways through article-aligned concept checkpoints, 
            knowledge mastery challenges, and verified trust progression.
          </p>
        </div>

        <div className="enterprise-card enterprise-card-interactive p-7 space-y-4">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Enterprise Editorial Governance
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Automated AI scanning, community appeals processing, and transparent editorial review
            ensure high platform integrity at scale.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Browse View - Modern Article Explorer
 */
export const BrowsePage = () => {
  const categories = [
    'All Topics',
    'Science',
    'Technology',
    'Environment',
    'History',
    'Health',
    'Business',
    'Education',
    'Other',
  ];

  const [articles, setArticles] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All Topics');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('lumen_token');

        const queryParams = new URLSearchParams();
        if (searchQuery.trim()) {
          queryParams.append('search', searchQuery.trim());
        }
        if (selectedCategory && selectedCategory !== 'All Topics') {
          queryParams.append('category', selectedCategory);
        }

        const apiBase = import.meta.env.VITE_API_URL || 'https://content-management-system-2-he9n.onrender.com/api';
        const url = `${apiBase}/articles?${queryParams.toString()}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setArticles(data.articles || []);
        }
      } catch (error) {
        console.error('Failed to load articles:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchArticles();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const filteredArticles = articles;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 rounded-full text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Content Intelligence Catalog</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Browse Articles & Topics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search peer-reviewed research, technological deep dives, and expert publications.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search articles, topics or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="enterprise-input w-full pl-10 pr-4 py-2.5"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'enterprise-card text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="enterprise-card p-6 space-y-4 animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
              <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded w-full" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="enterprise-card p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No articles found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            No articles matched your criteria. Try adjusting your search query or selecting a different topic.
          </p>
          {(searchQuery || selectedCategory !== 'All Topics') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Topics');
              }}
              className="px-4 py-2 text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Link
              key={article._id}
              to={`/browse/${article._id}`}
              className="enterprise-card enterprise-card-interactive p-6 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Category + Views */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[11px] text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full border border-blue-200/60 dark:border-blue-800/60">
                    {article.category || 'General'}
                  </span>

                  <span className="flex items-center gap-1 text-slate-400 text-[11px] font-mono">
                    <Eye className="w-3.5 h-3.5" />
                    {article.views || 0}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {article.description}
                </p>
              </div>

              {/* Author + Likes Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium truncate max-w-[150px]">
                  {article.author?.name || 'Unknown Author'}
                </span>

                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                  {article.likes || 0}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Write View (Article Editor Fallback)
 */
export const WritePage = () => {
  const { user } = useAuth();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [content, setContent] = React.useState('');
  const [category, setCategory] = React.useState('Technology');

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState('');

  const handleSubmit = async () => {
    if (!title.trim()) {
      setMessageType('error');
      setMessage('Please enter an article title.');
      return;
    }
    if (!content.trim()) {
      setMessageType('error');
      setMessage('Please enter article content.');
      return;
    }
    if (!user) {
      setMessageType('error');
      setMessage('Please login before submitting an article.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      setMessageType('');

      const token = localStorage.getItem('lumen_token');
      if (!token) {
        setMessageType('error');
        setMessage('Authentication token not found. Please login again.');
        return;
      }

      const apiBase = import.meta.env.VITE_API_URL || 'https://content-management-system-2-he9n.onrender.com/api';
      const createResponse = await fetch(`${apiBase}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          content: content.trim(),
          category,
          tags: [],
        }),
      });

      const createData = await createResponse.json();
      if (!createResponse.ok) {
        throw new Error(createData.message || 'Failed to create article.');
      }

      const articleId = createData.article?._id;
      if (!articleId) {
        throw new Error('Article was created but no article ID was returned.');
      }

      const submitResponse = await fetch(`${apiBase}/articles/${articleId}/submit`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const submitData = await submitResponse.json();
      if (!submitResponse.ok) {
        throw new Error(submitData.message || 'Failed to submit article for review.');
      }

      setMessageType('success');
      setMessage('Article submitted successfully for review!');
      setTitle('');
      setDescription('');
      setContent('');
      setCategory('Technology');
    } catch (error) {
      console.error('Submit article error:', error);
      setMessageType('error');
      setMessage(error.message || 'Something went wrong while submitting the article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Write New Article
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Authoring submission as <span className="font-semibold text-slate-700 dark:text-slate-300">{user?.name}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit for Review'}
        </button>
      </div>

      {message && (
        <div
          className={`px-4 py-3 rounded-xl text-xs font-medium border ${
            messageType === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
          }`}
        >
          {message}
        </div>
      )}

      <div className="enterprise-card p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider font-mono">
            Article Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter an engaging headline..."
            className="enterprise-input w-full px-4 py-3 text-base font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider font-mono">
            Short Excerpt
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief executive summary for cards and search indexing..."
            className="enterprise-input w-full px-4 py-2.5"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider font-mono">
            Topic Domain
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="enterprise-input w-full px-4 py-2.5"
          >
            <option value="Science">Science</option>
            <option value="Technology">Technology</option>
            <option value="Environment">Environment</option>
            <option value="Health">Health</option>
            <option value="History">History</option>
            <option value="Business">Business</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 uppercase tracking-wider font-mono">
            Content (Markdown Supported)
          </label>
          <textarea
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Draft your deep-dive article content here..."
            className="enterprise-input w-full p-4 font-mono text-xs sm:text-sm leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Admin View (Verification Center Fallback)
 */
export const AdminPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Admin Verification Center
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review pending submissions and editorial workflows
        </p>
      </div>

      <div className="enterprise-card p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Pending Review Queue
        </h2>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                The Future of Brain-Computer Interfaces
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                Submitted by Priya Mehta • 5 min read
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl font-semibold hover:bg-emerald-100 transition">
                Approve
              </button>
              <button className="px-3.5 py-1.5 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl font-semibold hover:bg-rose-100 transition">
                Request Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
