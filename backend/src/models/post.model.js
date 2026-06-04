const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Post = sequelize.define('Post', {
    postId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    stuffId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    recommendedStuffId: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    recommendedImageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
}, {
    tableName: 'posts',
    timestamps: true,
    paranoid: true,
    underscored: true,
});

module.exports = Post;