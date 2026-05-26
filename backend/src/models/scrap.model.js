const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Scrap = sequelize.define('Scrap', {
  scrapId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  postId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
}, {
  tableName: 'post_scraps',
  underscored: true,
  timestamps: true,
  paranoid: true,
});

module.exports = Scrap;