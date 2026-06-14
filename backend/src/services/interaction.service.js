const interactionRepository = require('../repositories/interaction.repository');
const { toInteractionResDTO, toStatsResDTO } = require('../converters/interaction.converter');
const stuffRepository = require('../repositories/stuff.repository');
const { NotFoundException } = require('../exceptions/custom.exception');
const userRepository = require('../repositories/user.repository');

const processInteraction = async (interactionData) => {
    const { userId, stuffId, reactionType } = interactionData;
    const user = await userRepository.findByUserId(userId);
    const isKorean = user.is_korean !== undefined ? user.is_korean : user.isKorean;
    
    const stuff = await stuffRepository.findStuffById(stuffId);
    if (!stuff) throw new NotFoundException('Stuff not found');

    const existingInteraction = await interactionRepository.findByUserAndStuff(userId, stuffId);
    const deletedInteraction = await interactionRepository.findDeletedByUserAndStuff(userId, stuffId);

    let currentAction = ''; 
    let savedEntity = null;

    if (!existingInteraction) {
        if (deletedInteraction) {
            if (deletedInteraction.reactionType === reactionType) {
                savedEntity = await interactionRepository.restoreInteraction(userId, stuffId, { isKorean });
                currentAction = 'CREATED';
            } else {
                await interactionRepository.restoreInteraction(userId, stuffId);
                savedEntity = await interactionRepository.updateInteraction(userId, stuffId, { reactionType, isKorean });
                currentAction = 'UPDATED';
            }
        } else {

            savedEntity = await interactionRepository.createInteraction({
                userId, stuffId, reactionType, isKorean
            });
            currentAction = 'CREATED';
        }
    } else if (existingInteraction.reactionType === reactionType) {
        await interactionRepository.deleteInteraction(existingInteraction.userId, existingInteraction.stuffId);
        currentAction = 'DELETED';
    } else {
        savedEntity = await interactionRepository.updateInteraction(userId, stuffId, { reactionType, isKorean });
        currentAction = 'UPDATED';
    }

    const rawStats = await interactionRepository.getInteractionStats(stuffId);

    return {
        action: currentAction,
        interaction: savedEntity ? toInteractionResDTO(savedEntity) : null,
        stats: toStatsResDTO(rawStats),
        isKorean: isKorean, // 응답에 포함
    };
};

const toggleInteraction = async (reqDTO) => {
    return await processInteraction(reqDTO);
};

const getInteractionStats = async (stuffId, userId = null) => {
    const rawStats = await interactionRepository.getInteractionStats(stuffId);
    const stats = toStatsResDTO(rawStats);

    let myReaction = null;
    let isKorean = null;

    if (userId) {
        const existing = await interactionRepository.findByUserAndStuff(userId, stuffId);
        if (existing) myReaction = existing.reactionType;

        const user = await userRepository.findByUserId(userId);
        if (user) {
            isKorean = user.is_korean !== undefined ? user.is_korean : user.isKorean;
        }
    }

    return { stats, myReaction, isKorean };
};

module.exports = {
    toggleInteraction,
    getInteractionStats,
};