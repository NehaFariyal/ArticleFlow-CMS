import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Hash, Layers3, RefreshCw } from 'lucide-react';
import { discoveryAPI } from '../services/api';

const SectionMessage = ({ children, onRetry }) => (
  <div className="rounded-2xl bg-[#FAF7F2] border border-[#EDE8DF] p-5 text-sm text-stone-600">
    <p>{children}</p>
    {onRetry && (
      <button onClick={onRetry} className="mt-3 inline-flex items-center gap-2 text-[#1A382B] font-semibold hover:underline">
        <RefreshCw className="w-3.5 h-3.5" /> Try again
      </button>
    )}
  </div>
);

const DiscoveryCard = ({ title, subtitle, icon: Icon, loading, error, errorMessage, empty, onRetry, children }) => (
  <section className="bg-white border border-[#EDE8DF] rounded-3xl p-6 sm:p-7 shadow-xs">
    <div className="flex items-start gap-3 mb-5">
      <div className="w-10 h-10 shrink-0 rounded-2xl bg-emerald-50 text-[#1A382B] flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="font-serif text-xl font-bold text-stone-900">{title}</h2>
        <p className="text-xs text-stone-500 mt-1">{subtitle}</p>
      </div>
    </div>
    {loading ? <SectionMessage>Loading discovery data…</SectionMessage>
      : error ? <SectionMessage onRetry={onRetry}>{errorMessage || 'Discovery data could not be loaded. Please retry.'}</SectionMessage>
        : empty ? <SectionMessage>No published articles are available yet. Check back as new writing appears.</SectionMessage>
          : children}
  </section>
);

export default function DiscoverySections() {
  const [topics, setTopics] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [topicState, setTopicState] = React.useState({ loading: true, error: false, errorMessage: '' });
  const [categoryState, setCategoryState] = React.useState({ loading: true, error: false, errorMessage: '' });

  const getRequestError = (error) => {
    if (error.response?.status === 404) {
      return 'The connected backend does not have the discovery routes yet. Deploy the current backend version and retry.';
    }
    return error.response?.data?.message || 'Discovery data could not be loaded. Please retry.';
  };

  const loadTopics = React.useCallback(async () => {
    setTopicState({ loading: true, error: false, errorMessage: '' });
    try {
      const { data } = await discoveryAPI.getTrendingTopics({ limit: 8 });
      setTopics(data.topics || []);
      setTopicState({ loading: false, error: false, errorMessage: '' });
    } catch (error) {
      setTopicState({ loading: false, error: true, errorMessage: getRequestError(error) });
    }
  }, []);
  const loadCategories = React.useCallback(async () => {
    setCategoryState({ loading: true, error: false, errorMessage: '' });
    try {
      const { data } = await discoveryAPI.getPopularCategories({ limit: 6 });
      setCategories(data.categories || []);
      setCategoryState({ loading: false, error: false, errorMessage: '' });
    } catch (error) {
      setCategoryState({ loading: false, error: true, errorMessage: getRequestError(error) });
    }
  }, []);

  React.useEffect(() => { loadTopics(); loadCategories(); }, [loadTopics, loadCategories]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DiscoveryCard title="Trending Topics" subtitle="Recurring subjects across published articles" icon={Hash} {...topicState} empty={!topics.length} onRetry={loadTopics}>
        <div className="flex flex-wrap gap-2">
          {topics.map(({ topic, articleCount }) => (
            <Link key={topic} to={`/browse?search=${encodeURIComponent(topic)}`} className="group inline-flex items-center gap-2 rounded-full border border-[#EDE8DF] bg-[#FAF7F2] px-3.5 py-2 text-sm text-stone-800 hover:border-[#1A382B] hover:bg-emerald-50 transition">
              <span className="font-semibold capitalize">{topic}</span>
              <span className="text-xs text-stone-500">{articleCount}</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#1A382B]" />
            </Link>
          ))}
        </div>
      </DiscoveryCard>

      <DiscoveryCard title="Popular Categories" subtitle="Lifetime views, likes and comments on articles published in the last 30 days" icon={Layers3} {...categoryState} empty={!categories.length} onRetry={loadCategories}>
        <div className="space-y-2">
          {categories.map(({ category, articleCount, views, likes, comments }) => (
            <Link key={category} to={`/browse?category=${encodeURIComponent(category)}`} className="flex items-center justify-between gap-4 rounded-2xl border border-[#F0ECE4] px-4 py-3 hover:border-[#1A382B] hover:bg-[#FAF7F2] transition">
              <span className="font-semibold text-sm text-stone-800">{category}</span>
              <span className="text-xs text-stone-500 text-right">{articleCount} articles · {views} views · {likes} likes · {comments} comments</span>
            </Link>
          ))}
        </div>
      </DiscoveryCard>
    </div>
  );
}
