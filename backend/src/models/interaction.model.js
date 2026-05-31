const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Interaction = sequelize.define('Interaction', {
    interactionId: { 
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        field: 'interaction_id'
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'user_id'
    },
    stuffId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'stuff_id'
    },
    reactionType: {
        type: DataTypes.ENUM('LIKE', 'DISLIKE'),
        allowNull: false,
        field: 'reaction_type' 
    },
    isKorean: {
    type: DataTypes.BOOLEAN,
    field: 'is_korean'
}
}, {
    tableName: 'interactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',

    paranoid: true, 
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'stuff_id']
        }
    ]
});

module.exports = Interaction;