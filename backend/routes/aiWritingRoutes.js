const express = require('express');
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const { assistWithWriting, summarize } = require('../controllers/aiWritingController');

const router = express.Router();

router.use(authenticateUser, authorizeRole('author', 'admin'));
router.post('/assist', assistWithWriting);
router.post('/summarize', summarize);

module.exports = router;
