const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Brand = sequelize.define('Brand', {
    brandId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    brandName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    logoUrl: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: 'https://example.com/default.png'
    },
    category: {
        type: DataTypes.ENUM('FOOD', 'HOUSEHOLD'),
        allowNull: false
    }
} , {
    tableName: 'brands',   
    timestamps: true,  // createdAt, updatedAt 자동 관리      
    paranoid: true,    // deletedAt 자동 관리    
    underscored: true, // db에 위 3가지 생성 (ex created_at)
})

module.exports = Brand;