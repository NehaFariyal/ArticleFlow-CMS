const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../server');
const Article = require('../models/Article');

describe('Article database readiness', () => {
  const originalMongoUri = process.env.MONGODB_URI;
  const originalMongoAlias = process.env.MONGO_URI;

  afterAll(() => {
    if (originalMongoUri === undefined) {
      delete process.env.MONGODB_URI;
    } else {
      process.env.MONGODB_URI = originalMongoUri;
    }
    if (originalMongoAlias === undefined) {
      delete process.env.MONGO_URI;
    } else {
      process.env.MONGO_URI = originalMongoAlias;
    }
  });

  it('rejects article saves clearly when MongoDB is not configured', async () => {
    delete process.env.MONGODB_URI;
    delete process.env.MONGO_URI;
    const createSpy = jest.spyOn(Article, 'create');
    const token = jwt.sign(
      { id: '66c9f1a00000000000000002', role: 'author' },
      process.env.JWT_SECRET
    );

    try {
      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'A draft article',
          content: 'Article content',
          category: 'Science',
          tags: ['test'],
        });

      expect(response.statusCode).toBe(503);
      expect(response.body).toMatchObject({
        success: false,
        code: 'DATABASE_UNAVAILABLE',
        category: 'configuration_missing',
        message: expect.stringContaining('No article was saved.'),
      });
      expect(createSpy).not.toHaveBeenCalled();
    } finally {
      createSpy.mockRestore();
    }
  });

  it('rejects article saves with an actionable error for a placeholder Atlas host', async () => {
    process.env.MONGODB_URI = 'mongodb+srv://test-user:test-password@your_cluster_host/articleflow';
    delete process.env.MONGO_URI;
    const createSpy = jest.spyOn(Article, 'create');
    const token = jwt.sign(
      { id: '66c9f1a00000000000000002', role: 'author' },
      process.env.JWT_SECRET
    );

    try {
      const response = await request(app)
        .post('/api/articles')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'A draft article',
          content: 'Article content',
          category: 'Science',
          tags: ['test'],
        });

      expect(response.statusCode).toBe(503);
      expect(response.body).toMatchObject({
        success: false,
        code: 'DATABASE_UNAVAILABLE',
        category: 'configuration_invalid',
      });
      expect(response.body.message).toMatch(/placeholder host/);
      expect(response.body.message).not.toContain('test-password');
      expect(createSpy).not.toHaveBeenCalled();
    } finally {
      createSpy.mockRestore();
    }
  });
});
