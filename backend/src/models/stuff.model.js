const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Stuff = sequelize.define('Stuff', {
    // 상품 ID
  stuffId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },

  // 브랜드 ID 참조
  brandId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'brands',
      key: 'brand_id',
    },
  },

  // 상품 이름
  stuffName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },

  // 상품 가격
  price: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },

  // 단종 여부
  isDiscontinued: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
     tableName: 'stuffs',   
     timestamps: true,  // createdAt, updatedAt 자동 관리      
     paranoid: true,    // deletedAt 자동 관리    
     underscored: true, // db에 위 3가지 생성 (ex created_at)
})

module.exports = Stuff;