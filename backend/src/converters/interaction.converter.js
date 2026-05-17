const { InteractionResDTO } = require('../dtos/interaction.dto');

const toInteractionResDTO = (interactionEntity) => {
    return new InteractionResDTO({
        userId: interactionEntity.userId,
        postId: interactionEntity.postId,
        reactionType: interactionEntity.reactionType,
        createdAt: interactionEntity.createdAt,
    });
};

module.exports = {
    toInteractionResDTO,
};