const https = require('https');

const MAX_CONTENT_LENGTH = 50000;
const MAX_GEMINI_RETRIES = 2;
const GEMINI_RETRY_BASE_DELAY_MS = 250;

const STOP_WORDS = new Set([
  'about', 'after', 'again', 'also', 'among', 'because', 'before', 'being',
  'between', 'could', 'during', 'every', 'first', 'from', 'have', 'into',
  'might', 'other', 'over', 'should', 'their', 'there', 'these', 'those',
  'through', 'under', 'until', 'using', 'very', 'which', 'while', 'would',
  'your', 'with', 'this', 'that', 'them', 'they', 'then', 'than', 'when',
  'where', 'what', 'will', 'were', 'been', 'such', 'more', 'most', 'some',
  'many', 'much', 'only', 'each', 'both', 'does', 'here', 'just', 'like',
  'make', 'made', 'into', 'onto', 'ours', 'the', 'and', 'for', 'are', 'but',
  'not', 'you', 'all', 'can', 'has', 'was', 'who', 'how', 'its', 'our',
  'out', 'use', 'way', 'new', 'one', 'two', 'get', 'his', 'her', 'she',
  'him', 'had', 'did', 'any', 'may', 'per', 'via', 'why', 'too', 'off',
  'own', 'now', 'got', 'let', 'say', 'see', 'old', 'day', 'man', 'men',
  'woman', 'women', 'article', 'introduction', 'conclusion',
]);

const splitSentences = (text) =>
  text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((sentence) => sentence.trim()).filter(Boolean) || [];

const extractiveSummary = (content, limit = 3) => {
  const sentences = splitSentences(content);
  if (sentences.length <= limit) return sentences.join(' ');

  const wordCounts = new Map();
  for (const word of content.toLowerCase().match(/[a-z][a-z'-]{2,}/g) || []) {
    if (!STOP_WORDS.has(word)) wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
  }

  const ranked = sentences.map((sentence, index) => {
    const words = sentence.toLowerCase().match(/[a-z][a-z'-]{2,}/g) || [];
    const score = words.reduce((sum, word) => sum + (wordCounts.get(word) || 0), 0) /
      Math.sqrt(Math.max(words.length, 1));
    return { sentence, index, score };
  });

  return ranked
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .sort((left, right) => left.index - right.index)
    .map(({ sentence }) => sentence)
    .join(' ');
};

const extractTags = (text, limit = 6) => {
  const frequencies = new Map();
  for (const word of text.toLowerCase().match(/[a-z][a-z'-]{2,}/g) || []) {
    if (!STOP_WORDS.has(word)) frequencies.set(word, (frequencies.get(word) || 0) + 1);
  }

  return [...frequencies.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([word]) => word);
};

const ruleBasedSuggestion = (action, { title = '', content = '', category = '' }) => {
  const sentences = splitSentences(content);
  switch (action) {
    case 'titles': {
      const subject = (title || sentences[0] || category || 'Your topic')
        .replace(/[.!?]+$/, '')
        .slice(0, 90);
      return [
        `${subject}: What You Need to Know`,
        `A Practical Guide to ${subject}`,
        `Understanding ${subject}: Key Ideas and Insights`,
      ];
    }
    case 'summary':
      return extractiveSummary(content, 2) || 'Add more article content to create a summary.';
    case 'tags':
      return extractTags(`${title} ${category} ${content}`);
    case 'readability':
      return [
        'Break long paragraphs into shorter sections with descriptive headings.',
        'Prefer direct, active-voice sentences and explain unfamiliar terms.',
        'Keep most sentences focused on one idea.',
      ];
    case 'takeaways':
      return sentences
        .filter((sentence) => sentence.split(/\s+/).length >= 6)
        .sort((left, right) => right.split(/\s+/).length - left.split(/\s+/).length)
        .slice(0, 4)
        .map((sentence) => sentence.length > 180 ? `${sentence.slice(0, 177).trim()}...` : sentence);
    default:
      throw new Error('Unsupported writing-assistance action.');
  }
};

const ruleBasedSummary = (content) => extractiveSummary(content, 5);

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const isRetryableGeminiError = (error) => {
  if ([401, 403].includes(error.statusCode)) return false;
  if ([429, 500, 502, 503, 504].includes(error.statusCode)) return true;

  const status = String(error.apiStatus || '').toUpperCase();
  if (status === 'RESOURCE_EXHAUSTED') return true;
  if (['INVALID_ARGUMENT', 'UNAUTHENTICATED', 'PERMISSION_DENIED'].includes(status)) return false;

  return /high[\s_-]*demand|resource[\s_-]*exhausted|overloaded|temporarily unavailable|capacity exceeded/i
    .test(error.message || '');
};

const requestGeminiOnce = (prompt) => new Promise((resolve, reject) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const payload = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
  });
  const request = https.request({
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/${encodeURIComponent(process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite')}:generateContent?key=${encodeURIComponent(apiKey)}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    },
    timeout: 45000,
  }, (response) => {
    let responseBody = '';
    response.setEncoding('utf8');
    response.on('data', (chunk) => { responseBody += chunk; });
    response.on('end', () => {
      let parsed;
      try {
        parsed = JSON.parse(responseBody);
      } catch {
        reject(new Error('The AI service returned an invalid response.'));
        return;
      }

      if (response.statusCode < 200 || response.statusCode >= 300) {
        const error = new Error(parsed.error?.message || `AI service request failed (${response.statusCode}).`);
        error.statusCode = response.statusCode;
        error.apiStatus = parsed.error?.status || parsed.error?.reason;
        reject(error);
        return;
      }

      const text = parsed.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join('')
        .trim();
      if (!text) {
        reject(new Error('The AI service returned no suggestion.'));
        return;
      }

      try {
        resolve(JSON.parse(text));
      } catch {
        reject(new Error('The AI service returned an invalid suggestion format.'));
      }
    });
  });

  request.on('timeout', () => request.destroy(new Error('The AI service request timed out.')));
  request.on('error', reject);
  request.end(payload);
});

const requestGemini = async (prompt) => {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await requestGeminiOnce(prompt);
    } catch (error) {
      if (attempt >= MAX_GEMINI_RETRIES || !isRetryableGeminiError(error)) {
        throw error;
      }

      const retryDelay = GEMINI_RETRY_BASE_DELAY_MS * (2 ** attempt);
      console.warn(
        `[AI Writing] Temporary Gemini error${error.statusCode ? ` (${error.statusCode})` : ''}; retrying in ${retryDelay}ms (attempt ${attempt + 1}/${MAX_GEMINI_RETRIES}).`
      );
      await delay(retryDelay);
    }
  }
};

const buildPrompt = (action, data) => {
  const actionInstructions = {
    titles: 'Return JSON with "suggestions": an array of exactly 3 distinct, accurate alternative article titles.',
    summary: 'Return JSON with "suggestion": a concise summary of 2-3 sentences.',
    tags: 'Return JSON with "suggestions": an array of 4-8 short, relevant tags without hash symbols.',
    readability: 'Return JSON with "suggestions": an array of 3-5 concrete readability improvements for this draft. Do not rewrite or invent facts.',
    takeaways: 'Return JSON with "suggestions": an array of 3-5 concise key takeaways grounded only in this draft.',
    summarize: 'Return JSON with "suggestion": a clear, faithful summary of the article in 3-5 sentences.',
  };

  return [
    'You are a careful writing assistant. Do not invent claims or facts not present in the supplied draft.',
    actionInstructions[action],
    `Title: ${data.title || '(not provided)'}`,
    `Category: ${data.category || '(not provided)'}`,
    `Article:\n${data.content}`,
    'Return only the requested JSON object.',
  ].join('\n\n');
};

const normalizeValue = (action, result) => {
  const isArrayAction = ['titles', 'tags', 'readability', 'takeaways'].includes(action);
  const value = isArrayAction ? result.suggestions : result.suggestion;
  if (isArrayAction && Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    return value.map((item) => item.trim()).filter(Boolean).slice(0, 8);
  }
  if (!isArrayAction && typeof value === 'string' && value.trim()) return value.trim();
  throw new Error('The AI service response did not contain the expected suggestion.');
};

const generateSuggestion = async (action, data) => {
  if (!process.env.GEMINI_API_KEY) {
    return {
      value: ruleBasedSuggestion(action, data),
      provider: 'rule-based',
      message: 'Gemini is not configured. These suggestions were created with local rule-based analysis, not an AI model.',
    };
  }

  try {
    const value = normalizeValue(action, await requestGemini(buildPrompt(action, data)));
    return { value, provider: 'gemini', message: 'Generated with Gemini.' };
  } catch (error) {
    console.error('[AI Writing] Gemini request failed; using rule-based fallback:', error.message);
    return {
      value: ruleBasedSuggestion(action, data),
      provider: 'rule-based',
      message: `Gemini is currently unavailable (${error.message}). These suggestions are rule-based, not AI-generated.`,
    };
  }
};

const summarizeArticle = async (content) => {
  if (!process.env.GEMINI_API_KEY) {
    return {
      value: ruleBasedSummary(content),
      provider: 'rule-based',
      message: 'Gemini is not configured. This extractive summary selects sentences from your article; it was not generated by an AI model.',
    };
  }

  try {
    const value = normalizeValue('summarize', await requestGemini(buildPrompt('summarize', { content })));
    return { value, provider: 'gemini', message: 'Generated with Gemini.' };
  } catch (error) {
    console.error('[AI Writing] Gemini summary failed; using extractive fallback:', error.message);
    return {
      value: ruleBasedSummary(content),
      provider: 'rule-based',
      message: `Gemini is currently unavailable (${error.message}). This extractive summary selects sentences from your article; it is not AI-generated.`,
    };
  }
};

module.exports = {
  MAX_CONTENT_LENGTH,
  extractiveSummary,
  extractTags,
  generateSuggestion,
  ruleBasedSuggestion,
  summarizeArticle,
};
