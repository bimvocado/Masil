const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  login_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  nickname: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  birth_date: {
    type: DataTypes.DATEONLY, 
    allowNull: false,
  },
  profile_image_url: {
    type: DataTypes.STRING(255),
    defaultValue: 'https://example.com/default.png',
  },
  is_korean: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
}, {
  tableName: 'users',      
  underscored: true,     
  timestamps: true,        
  paranoid: true,         
});

module.exports = User;