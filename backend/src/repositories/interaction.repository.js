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

    static async createInteraction({ userId, stuffId, reactionType }) {
        return await Interaction.create({ userId, stuffId, reactionType });
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

    static async restoreInteraction(userId, stuffId) {
        const interaction = await this.findDeletedByUserAndStuff(userId, stuffId);
        if (!interaction) return null;
        await interaction.restore();
        return interaction;
    }

    static async getInteractionStats(stuffId) {
        const stats = await Interaction.findAll({
            attributes: [
                'reactionType',
                [sequelize.fn('COUNT', sequelize.col('Interaction.interaction_id')), 'count']
            ],
            include: [{
                model: User, 
                attributes: ['isKorean'],
                required: true
            }],
            where: { stuffId },
            group: ['User.is_korean', 'Interaction.reaction_type'],
            raw: true
        });

        return stats;
    }
}

module.exports = InteractionRepository;