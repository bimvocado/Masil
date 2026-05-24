const { InteractionResDTO } = require('../dtos/interaction.dto');

const toInteractionResDTO = (interactionEntity) => {
    return new InteractionResDTO(
        interactionEntity.userId,
        interactionEntity.stuffId,
        interactionEntity.reactionType,
        interactionEntity.createdAt
    );
};

// 통계 데이터 가공
const toStatsResDTO = (rawStats) => {
    const result = {
        total: 0,
        like: { total: 0, korean: 0, foreigner: 0, ratio: 0 },
        dislike: { total: 0, korean: 0, foreigner: 0, ratio: 0 }
    };

    rawStats.forEach(stat => {
        const count = parseInt(stat.count, 10); 
        const isKorean = stat['User.is_korean'] || stat.isKorean; 
        const type = stat.reactionType === 'LIKE' ? 'like' : 'dislike';

        result.total += count;
        result[type].total += count;
        
        if (isKorean) {
            result[type].korean += count;
        } else {
            result[type].foreigner += count;
        }
    });

    if (result.total > 0) {
        result.like.ratio = Math.round((result.like.total / result.total) * 100);
        result.dislike.ratio = 100 - result.like.ratio; 
    }

    return result;
};

module.exports = {
    toInteractionResDTO,
    toStatsResDTO,
};