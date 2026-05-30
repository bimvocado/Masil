const express = require('express');
const router = express.Router();
const scrapController = require('../controllers/scrap.controller');

router.get('/categories/:categoryId/posts', scrapController.getScrapsByCategory);
router.post('/:postId/scrap', scrapController.createScrap);
router.delete('/:postId/scrap', scrapController.deleteScrap);
router.get('/:postId/scrap/status', scrapController.getScrapStatus);

module.exports = router;