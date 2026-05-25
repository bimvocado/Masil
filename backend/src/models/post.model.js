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
    // title: {
    //     type: DataTypes.STRING(100),
    //     allowNull: false
    // }
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
    }
}, {
    tableName: 'posts',   
    timestamps: true,  // createdAt, updatedAt 자동 관리      
    paranoid: true,    // deletedAt 자동 관리    
    underscored: true, // db에 위 3가지 생성 (ex created_at)
})

module.exports = Post;