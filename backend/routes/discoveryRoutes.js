const express = require('express');
const { getTrendingTopics, getPopularCategories } = require('../controllers/discoveryController');

const router = express.Router();
router.get('/trending-topics', getTrendingTopics);
router.get('/popular-categories', getPopularCategories);

module.exports = router;
