const express = require('express');

const interactionController = require('../controllers/interaction.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const interactionValidator = require('../validators/interaction.validator');

const router = express.Router();

router.post(
    '/:stuffId/interactions',
    authMiddleware,
    interactionValidator.validateToggleInteraction,
    interactionController.toggleInteraction
);

router.get(
    '/:stuffId/interactions',
    interactionValidator.validateGetStats,
    interactionController.getInteractionStats
);

module.exports = router;