const express = require('express');
const router = express.Router();
const scrapController = require('../controllers/scrap.controller');
const { authMiddleware, optionalAuthMiddleware } = require('../middlewares/auth.middleware');

router.get('/categories/:categoryId/posts', optionalAuthMiddleware, scrapController.getScrapsByCategory);
router.post('/:postId/scrap', authMiddleware, scrapController.createScrap);
router.delete('/:postId/scrap', authMiddleware, scrapController.deleteScrap);
router.get('/:postId/scrap/status', optionalAuthMiddleware, scrapController.getScrapStatus);

module.exports = router;