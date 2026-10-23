const {
  MAX_CONTENT_LENGTH,
  generateSuggestion,
  summarizeArticle,
} = require('../services/aiWritingService');

const ACTIONS = new Set(['titles', 'summary', 'tags', 'readability', 'takeaways']);

const validateContent = (content, res) => {
  if (typeof content !== 'string' || !content.trim()) {
    res.status(400).json({ success: false, message: 'Article content is required.' });
    return false;
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    res.status(413).json({
      success: false,
      message: `Article content must be ${MAX_CONTENT_LENGTH.toLocaleString()} characters or fewer.`,
    });
    return false;
  }
  return true;
};

const assistWithWriting = async (req, res) => {
  const { action, title = '', content = '', category = '' } = req.body || {};
  if (!ACTIONS.has(action)) {
    return res.status(400).json({
      success: false,
      message: 'Choose one of: titles, summary, tags, readability, or takeaways.',
    });
  }
  if (!validateContent(content, res)) return;
  if (typeof title !== 'string' || typeof category !== 'string') {
    return res.status(400).json({ success: false, message: 'Title and category must be text.' });
  }

  try {
    const result = await generateSuggestion(action, {
      title: title.slice(0, 200),
      content: content.trim(),
      category: category.slice(0, 100),
    });
    return res.status(200).json({ success: true, action, ...result });
  } catch (error) {
    console.error('[AI Writing] Suggestion failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to generate a writing suggestion. Please try again.',
    });
  }
};

const summarize = async (req, res) => {
  const { content } = req.body || {};
  if (!validateContent(content, res)) return;

  try {
    const result = await summarizeArticle(content.trim());
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error('[AI Writing] Summarization failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to summarize this article. Please try again.',
    });
  }
};

module.exports = { assistWithWriting, summarize };
