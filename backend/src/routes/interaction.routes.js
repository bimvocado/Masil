const express = require('express');

const interactionController = require('../controllers/interaction.controller');
const {authMiddleware} = require('../middlewares/auth.middleware');
const { optionalAuthMiddleware } = require('../middlewares/optionalAuth.middleware');
const interactionValidator = require('../validators/interaction.validator');
const { validateToggleInteraction, validateGetStats } = require('../validators/interaction.validator');
const router = express.Router();


console.log('--- 미들웨어 점검 ---');
console.log('1. authMiddleware:', typeof authMiddleware);
console.log('2. validator:', typeof interactionValidator?.validateToggleInteraction);
console.log('3. controller:', typeof interactionController?.toggleInteraction);

router.post(
    '/:stuffId/interactions',
    authMiddleware,
    validateToggleInteraction,
    interactionController.toggleInteraction
);

router.get(
    '/:stuffId/interactions',
    optionalAuthMiddleware,
    validateGetStats,
    interactionController.getInteractionStats
);

module.exports = router;

