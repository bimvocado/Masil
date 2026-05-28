const interactionRepository = require('../repositories/interaction.repository');
const { toInteractionResDTO, toStatsResDTO } = require('../converters/interaction.converter');
const stuffRepository = require('../repositories/stuff.repository');
const { NotFoundException, BadRequestException } = require('../exceptions/custom.exception');

const processInteraction = async (interactionData) => {
    const { userId, stuffId, reactionType } = interactionData;

    const stuff = await stuffRepository.findStuffById(stuffId);
    if (!stuff) {
        throw new NotFoundException('Stuff not found');
    }

    const existingInteraction = await interactionRepository.findByUserAndStuff(userId, stuffId);
    const deletedInteraction = await interactionRepository.findDeletedByUserAndStuff(userId, stuffId);

    let currentAction = ''; 
    let savedEntity = null;

    if (!existingInteraction) {
        if (deletedInteraction) {
            if (deletedInteraction.reactionType === reactionType) {
                savedEntity = await interactionRepository.restoreInteraction(userId, stuffId);
                currentAction = 'CREATED';
            } else {
                await interactionRepository.restoreInteraction(userId, stuffId);
                savedEntity = await interactionRepository.updateInteraction(userId, stuffId, { reactionType });
                currentAction = 'UPDATED';
            }
        } else {
            savedEntity = await interactionRepository.createInteraction({
                userId,
                stuffId,
                reactionType
            });
            currentAction = 'CREATED';
        }
    } else if (existingInteraction.reactionType === reactionType) {
        await interactionRepository.deleteInteraction(existingInteraction.userId, existingInteraction.stuffId);
        currentAction = 'DELETED';
    } else {
        savedEntity = await interactionRepository.updateInteraction(existingInteraction.userId, existingInteraction.stuffId, { reactionType });
        currentAction = 'UPDATED';
    }

    const rawStats = await interactionRepository.getInteractionStats(stuffId);

    return {
        action: currentAction,
        interaction: savedEntity ? toInteractionResDTO(savedEntity) : null,
        stats: toStatsResDTO(rawStats)
    };
};

const toggleInteraction = async (reqDTO) => {
  return await processInteraction(reqDTO);
};

const getInteractionStats = async (stuffId) => {
  const rawStats = await interactionRepository.getInteractionStats(stuffId);
  return toStatsResDTO(rawStats);
};

module.exports = {
  toggleInteraction,
  getInteractionStats,
};