const { InteractionResDTO } = require('../dtos/interaction.dto');

const toInteractionResDTO = (interactionEntity) => {
    if (!interactionEntity) return null;
    return new InteractionResDTO(
        interactionEntity.userId || interactionEntity.user_id,
        interactionEntity.stuffId || interactionEntity.stuff_id,
        interactionEntity.reactionType || interactionEntity.reaction_type,
        interactionEntity.createdAt
    );
};

const toStatsResDTO = (rawStats) => {
    const result = {
        total: 0,
        like: { total: 0, korean: 0, foreigner: 0, ratio: 0 },
        dislike: { total: 0, korean: 0, foreigner: 0, ratio: 0 }
    };

    if (!rawStats || !Array.isArray(rawStats)) return result;

    rawStats.forEach(stat => {
        const count = parseInt(stat.count, 10) || 0; 
        
        const rawIsKorean = stat['User.isKorean'] ?? stat['User.is_korean'] ?? stat.isKorean; 
        
        const isKorean = (rawIsKorean == 1 || rawIsKorean === true); 
        const reactionType = String(stat.reactionType).toUpperCase();
        const type = reactionType === 'LIKE' ? 'like' : 'dislike';

        result.total += count;
        result[type].total += count;
        
        if (isKorean) {
            result[type].korean += count;
        } else {
            result[type].foreigner += count;
        }
    });

    if (result.total > 0) {
        result.like.ratio = result.total > 0 ? Math.round((result.like.total / result.total) * 100) : 0;
        result.dislike.ratio = result.total > 0 ? (100 - result.like.ratio) : 0; 
    }

    return result;
};

// 3. 내보내기 (가장 확실한 방법)
module.exports = {
    toInteractionResDTO,
    toStatsResDTO,
};