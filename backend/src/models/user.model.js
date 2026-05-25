const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  loginId: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  nickname: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  birthDate: {
    type: DataTypes.DATEONLY, 
    allowNull: true,
  },
  profileImageUrl: {
    type: DataTypes.STRING(255),
    defaultValue: 'https://example.com/default.png',
  },
  isKorean: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },

  provider: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'local', // local, google, kakao
  },
  socialId: {
    type: DataTypes.STRING(255),
    allowNull: true, // 소셜 로그인일 때만 구글 고유 ID 저장
  },
}, {
  tableName: 'users',
  underscored: true,
  timestamps: true,      
}





);

module.exports = User;