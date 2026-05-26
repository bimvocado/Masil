const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Comment = sequelize.define('Comment', {
  commentId: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  postId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  parentCommentId: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
}, {
  tableName: 'comments',
  underscored: true,
  timestamps: true,
  paranoid: true,
});

module.exports = Comment;