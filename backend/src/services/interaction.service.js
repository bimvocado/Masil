const interactionRepository = require('../repositories/interaction.repository');
const { toInteractionResDTO } = require('../converters/interaction.converter');
const { NotFoundException, BadRequestException } = require('../exceptions/custom.exception');

const processInteraction = async (interactionData) => {
    const { userId, stuffId, reactionType } = interactionData;

    const stuff = await stuffRepository.findById(stuffId);
    if (!stuff) {
        throw new NotFoundException('Stuff not found');
    }

    const existingInteraction = await interactionRepository.findByUserAndStuff(userId, stuffId);

    let currentAction = '';
    let savedEntity = null;

    if (!existingInteraction) {
        savedEntity = await interactionRepository.create({
            userId,
            stuffId,
            reactionType
        });
        currentAction = 'CREATED';
    } else if (existingInteraction.reactionType === reactionType) {
        await interactionRepository.delete(existingInteraction.id);
        currentAction = 'DELETED';
    } else {
        savedEntity = await interactionRepository.update(existingInteraction.id, { reactionType });
        currentAction = 'UPDATED';
    }

    const updatedStats = await getStats(stuffId);

    return {
        action: currentAction,
        ineraction: savedEntity ? toInteractionResDTO(savedEntity) : null,
        stats: updatedStats
    };
};