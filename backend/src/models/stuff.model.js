const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Stuff = sequelize.define('Stuff', {
    stuffId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    brandId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    stuffName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    isDiscontinued: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
     tableName: 'stuffs',   
     timestamps: true,  // createdAt, updatedAt 자동 관리      
     paranoid: true,    // deletedAt 자동 관리    
     underscored: true, // db에 위 3가지 생성 (ex created_at)
})

module.exports = Stuff;