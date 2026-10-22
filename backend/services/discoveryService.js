const mongoose = require('mongoose');
const Article = require('../models/Article');

const STOP_WORDS = new Set(
  'a an and are as at be been being but by can could did do does for from had has have he her hers him his how i if in into is it its may me more most my no not of on or our ours she should so than that the their theirs them then there these they this those through to too up us was we were what when where which who why will with would you your'.split(' ')
);
const MAX_TOPICS = 12;
const DEFAULT_LIMIT = 8;

const normalizeLimit = (value) => {
  if (value === undefined) return DEFAULT_LIMIT;
  if (!/^\d+$/.test(String(value))) return null;
  const limit = Number(value);
  return limit >= 1 && limit <= 25 ? limit : null;
};

const isMongoConnected = () => mongoose.connection?.readyState === 1;

const getPublishedArticles = async () => {
  if (isMongoConnected()) {
    return Article.find({ status: 'published' })
      .select('title description content tags category views likes publishedAt createdAt')
      .lean();
  }
  const { inMemoryArticles = [] } = require('../models/articleStore');
  return inMemoryArticles.filter((article) => article.status === 'published');
};

const getCommentCounts = async (articles) => {
  const ids = articles.map((article) => String(article._id || article.id || '')).filter(Boolean);
  if (!ids.length) return new Map();

  const Comment = require('../models/Comment');
  if (isMongoConnected()) {
    const counts = await Comment.aggregate([
      { $match: { targetType: 'article', targetId: { $in: ids } } },
      { $group: { _id: '$targetId', count: { $sum: 1 } } },
    ]);
    return new Map(counts.map(({ _id, count }) => [String(_id), count]));
  }

  const commentStore = require('../models/commentStore');
  const comments = await commentStore.getRecentComments();
  const allowed = new Set(ids);
  const counts = new Map();
  for (const comment of comments) {
    if (comment.targetType === 'article' && allowed.has(String(comment.targetId))) {
      const id = String(comment.targetId);
      counts.set(id, (counts.get(id) || 0) + 1);
    }
  }
  return counts;
};

const extractTopics = (articles, limit = DEFAULT_LIMIT) => {
  const counts = new Map();
  for (const article of articles) {
    const terms = new Set();
    for (const source of [article.title, article.description, article.content, article.category]) {
      const tokens = String(source || '').toLowerCase().match(/[a-z][a-z'-]{1,}/g) || [];
      for (const token of tokens) {
        const normalized = token.replace(/^'+|'+$/g, '');
        if (normalized.length >= 3 && !STOP_WORDS.has(normalized)) terms.add(normalized);
      }
    }
    for (const tag of article.tags || []) {
      const normalized = String(tag || '').trim().toLowerCase();
      if (normalized.length >= 2 && !STOP_WORDS.has(normalized)) terms.add(normalized);
    }
    for (const term of terms) counts.set(term, (counts.get(term) || 0) + 1);
  }

  return [...counts]
    .filter(([, articleCount]) => articleCount >= 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, Math.min(limit, MAX_TOPICS))
    .map(([topic, articleCount]) => ({ topic, articleCount }));
};

const getTrendingTopics = async (limit) => {
  const articles = await getPublishedArticles();
  return extractTopics(articles, limit);
};

const getPopularCategories = async (limit, now = new Date()) => {
  const articles = await getPublishedArticles();
  const commentCounts = await getCommentCounts(articles);
  const recentCutoff = now.getTime() - 30 * 24 * 60 * 60 * 1000;
  const categories = new Map();

  for (const article of articles) {
    const category = String(article.category || '').trim();
    const publishedDate = new Date(article.publishedAt || article.createdAt || 0);
    if (!category || Number.isNaN(publishedDate.getTime()) || publishedDate.getTime() < recentCutoff) continue;
    const id = String(article._id || article.id || '');
    const current = categories.get(category) || { category, articleCount: 0, views: 0, likes: 0, comments: 0 };
    current.articleCount += 1;
    current.views += Number.isFinite(Number(article.views)) ? Math.max(0, Number(article.views)) : 0;
    current.likes += Number.isFinite(Number(article.likes)) ? Math.max(0, Number(article.likes)) : 0;
    current.comments += commentCounts.get(id) || 0;
    categories.set(category, current);
  }

  return [...categories.values()]
    .map((item) => ({
      ...item,
      // Ranking score uses stored lifetime totals for articles published in the last 30 days.
      // Views are weighted 1 point, likes 5 points, and comments 8 points.
      score: item.views + item.likes * 5 + item.comments * 8,
    }))
    .sort((a, b) => b.score - a.score || a.category.localeCompare(b.category))
    .slice(0, limit);
};

module.exports = { normalizeLimit, extractTopics, getTrendingTopics, getPopularCategories };
