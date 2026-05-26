const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Hashtag = sequelize.define('Hashtag', {
    hashtagId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    count: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'hashtags',   
    timestamps: true,    // createdAt, updatedAt 자동 관리      
    paranoid: true,      // deletedAt 자동 관리    
    underscored: true,  // db에 위 3가지 생성 (ex created_at)
})

module.exports = Hashtag;