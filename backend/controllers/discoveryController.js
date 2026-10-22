const discoveryService = require('../services/discoveryService');

const getTrendingTopics = async (req, res) => {
  const limit = discoveryService.normalizeLimit(req.query.limit);
  if (limit === null) {
    return res.status(400).json({ success: false, message: 'Limit must be an integer between 1 and 25.' });
  }
  try {
    const topics = await discoveryService.getTrendingTopics(limit);
    return res.json({ success: true, count: topics.length, topics });
  } catch (error) {
    console.error('[Discovery topics error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to load trending topics.' });
  }
};

const getPopularCategories = async (req, res) => {
  const limit = discoveryService.normalizeLimit(req.query.limit);
  if (limit === null) {
    return res.status(400).json({ success: false, message: 'Limit must be an integer between 1 and 25.' });
  }
  try {
    const categories = await discoveryService.getPopularCategories(limit);
    return res.json({
      success: true,
      count: categories.length,
      ranking: 'views + 5 × likes + 8 × comments, using lifetime totals for articles published in the last 30 days',
      categories,
    });
  } catch (error) {
    console.error('[Discovery categories error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to load popular categories.' });
  }
};

module.exports = { getTrendingTopics, getPopularCategories };
