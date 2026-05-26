const commentRepository = require('../repositories/comment.repository');

const getComments = async (postId) => {
  return await commentRepository.findCommentsByPostId(postId);
};

const createComment = async (postId, userId, text) => {
  return await commentRepository.createComment(postId, userId, text);
};

const updateComment = async (commentId, text) => {
  return await commentRepository.updateComment(commentId, text);
};

const deleteComment = async (commentId) => {
  return await commentRepository.deleteComment(commentId);
};

module.exports = { getComments, createComment, updateComment, deleteComment };