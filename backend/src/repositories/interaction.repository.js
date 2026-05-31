const Interaction = require('../models/interaction.model');
const User = require('../models/user.model');
const sequelize = require('../config/db');

class InteractionRepository {

    static async findByUserAndStuff(userId, stuffId) {
        return await Interaction.findOne({
            where: { userId, stuffId }
        });
    }

    static async findDeletedByUserAndStuff(userId, stuffId) {
        return await Interaction.findOne({
            where: { userId, stuffId },
            paranoid: false,
        });
    }


    static async createInteraction({ userId, stuffId, reactionType, isKorean }) {
        return await Interaction.create({ 
            userId, 
            stuffId, 
            reactionType,
            isKorean: isKorean,
        });
    }

    static async updateInteraction(userId, stuffId, updateData) {
        await Interaction.update(
            updateData, 
            { where: { userId, stuffId } }
        );

        return await this.findByUserAndStuff(userId, stuffId);
    }

    static async deleteInteraction(userId, stuffId) {
        return await Interaction.destroy({
            where: { userId, stuffId },
            force: true,
            paranoid: false,
        });
    }

    static async restoreInteraction(userId, stuffId, updateData = {}) {
        const interaction = await this.findDeletedByUserAndStuff(userId, stuffId);
        if (!interaction) return null;
        
        await interaction.restore();
        
        // 국적이 바뀌었을 수 있으므로 복구와 동시에 업데이트
        if (Object.keys(updateData).length > 0) {
            await interaction.update(updateData);
        }
        
        return interaction;
    }

   static async getInteractionStats(stuffId) {
    return await Interaction.findAll({
        attributes: [
            'reactionType',
            'isKorean', // 조인 안 하고 자기 테이블 컬럼 사용!
            [sequelize.fn('COUNT', sequelize.col('interaction_id')), 'count']
        ],
        where: { stuffId },
        group: ['is_korean', 'reaction_type'], // 자기 컬럼으로 그룹화
        raw: true
    });
}
}

module.exports = InteractionRepository;