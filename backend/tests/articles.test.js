const request = require('supertest');
const app = require('../server');
const jwt = require('jsonwebtoken');

jest.setTimeout(15000);
const jwtSecret =
  process.env.JWT_SECRET || 'lumen_test_only_secret_for_jest';

const testToken = jwt.sign(
  { id: '66c9f1a00000000000000001' },
  jwtSecret
);

describe('Articles API Tests', () => {

  it('GET /api/articles - should fetch all published articles', async () => {
    const res = await request(app).get('/api/articles');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.articles)).toBe(true);
  });

  it('GET /api/articles?search=CRISPR - should filter articles by query', async () => {
    const res = await request(app).get('/api/articles?search=CRISPR');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.articles)).toBe(true);
  });

  it('GET /api/articles/:id/recommendations - should fetch article recommendations', async () => {
    const res = await request(app).get('/api/articles/66c9f2b00000000000000001/recommendations');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.recommendations)).toBe(true);
  });

  it('GET /api/articles - public requests should not include non-published articles', async () => {
    const res = await request(app).get('/api/articles');
    expect(res.statusCode).toBe(200);
    const nonPublished = res.body.articles.filter(a => a.status !== 'published');
    expect(nonPublished.length).toBe(0);
  });
    it('GET /api/articles/recommendations/for-you - should require authentication', async () => {
    const res = await request(app)
      .get('/api/articles/recommendations/for-you');

    expect(res.statusCode).toBe(401);
  });

  it('GET /api/articles/recommendations/for-you - should return published recommendations for an authenticated user', async () => {
    const res = await request(app)
      .get('/api/articles/recommendations/for-you')
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.recommendations)).toBe(true);

    expect(
      res.body.recommendations.every(
        (article) => article.status === 'published'
      )
    ).toBe(true);
  });

    it('POST /api/articles/:id/read - should save reading history for an authenticated user', async () => {
    const articlesRes = await request(app).get('/api/articles');

    expect(articlesRes.statusCode).toBe(200);

    const article = articlesRes.body.articles[0];

    expect(article).toBeDefined();

    const res = await request(app)
      .post(`/api/articles/${article._id || article.id}/read`)
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.readingHistory)).toBe(true);

    expect(
      res.body.readingHistory.some(
        (item) =>
          String(item.articleId) === String(article._id || article.id)
      )
    ).toBe(true);
  });

  it('POST /api/articles/:id/read - should require authentication', async () => {
    const res = await request(app)
      .post('/api/articles/66c9f2b00000000000000001/read');

    expect(res.statusCode).toBe(401);
  });
});
