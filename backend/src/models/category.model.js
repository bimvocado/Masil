const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
  categoryId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  categoryName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'categories',
  underscored: true,
  timestamps: true,
  paranoid: true,
});

module.exports = Category;