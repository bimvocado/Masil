const Comment = require('../models/comment.model');

const findCommentsByPostId = async (postId) => {
  return await Comment.findAll({
    where: { postId },
  });
};

const createComment = async (postId, userId, text) => {
  return await Comment.create({ postId, userId, text });
};

const updateComment = async (commentId, text) => {
  const comment = await Comment.findOne({ where: { commentId } });
  if (!comment) return null;
  comment.text = text;
  return await comment.save();
};

const deleteComment = async (commentId) => {
  const comment = await Comment.findOne({ where: { commentId } });
  if (!comment) return null;
  return await comment.destroy();
};

module.exports = { findCommentsByPostId, createComment, updateComment, deleteComment };