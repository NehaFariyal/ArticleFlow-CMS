const request = require('supertest');
const app = require('../server');
const { extractTopics, getTrendingTopics, getPopularCategories } = require('../services/discoveryService');

describe('Topic and category discovery', () => {
  it('counts terms once per published article and filters common words', () => {
    const topics = extractTopics([
      { title: 'Clean energy and solar energy', tags: ['Solar'], category: 'Science' },
      { title: 'Solar power for the future', tags: ['energy'], category: 'Other' },
    ], 10);
    expect(topics).toContainEqual({ topic: 'solar', articleCount: 2 });
    expect(topics).toContainEqual({ topic: 'energy', articleCount: 2 });
    expect(topics.some(({ topic }) => topic === 'the')).toBe(false);
  });

  it('does not emit single-article topics', () => {
    expect(extractTopics([{ title: 'A unique keyword', tags: [] }], 10)).toEqual([]);
  });

  it('returns empty discovery results when there are no published articles', async () => {
    const store = require('../models/articleStore');
    const original = store.inMemoryArticles;
    store.inMemoryArticles = [];
    try {
      await expect(getTrendingTopics(8)).resolves.toEqual([]);
      await expect(getPopularCategories(6)).resolves.toEqual([]);
    } finally {
      store.inMemoryArticles = original;
    }
  });

  it('excludes drafts and only counts public articles for trending topics', async () => {
    const store = require('../models/articleStore');
    const original = store.inMemoryArticles;
    store.inMemoryArticles = [
      ...original,
      { title: 'quasarprivate', tags: [], status: 'published' },
      { title: 'quasarprivate', tags: [], status: 'draft' },
    ];
    try {
      const topics = await getTrendingTopics(25);
      expect(topics.some(({ topic }) => topic === 'quasarprivate')).toBe(false);
    } finally {
      store.inMemoryArticles = original;
    }
  });

  it('ranks recent categories using stored engagement and ignores stale articles', async () => {
    const categories = await getPopularCategories(25, new Date());
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty('score');
    expect(categories.every((item) => item.articleCount > 0)).toBe(true);
    expect(categories.every((item) => item.score === item.views + 5 * item.likes + 8 * item.comments)).toBe(true);
  });

  it('serves public topic and category results and validates limits', async () => {
    const [topics, categories, invalid] = await Promise.all([
      request(app).get('/api/discovery/trending-topics'),
      request(app).get('/api/discovery/popular-categories'),
      request(app).get('/api/discovery/trending-topics?limit=1000'),
    ]);
    expect(topics.statusCode).toBe(200);
    expect(topics.body.success).toBe(true);
    expect(topics.body.count).toBeGreaterThan(0);
    expect(Array.isArray(topics.body.topics)).toBe(true);
    expect(categories.statusCode).toBe(200);
    expect(categories.body.count).toBeGreaterThan(0);
    expect(Array.isArray(categories.body.categories)).toBe(true);
    expect(categories.body.ranking).toMatch(/views/);
    expect(invalid.statusCode).toBe(400);
  });

  it('rejects malformed article search parameters used by topic links', async () => {
    const malformed = await request(app).get('/api/articles?search%5B%5D=solar');
    expect(malformed.statusCode).toBe(400);
  });
});
