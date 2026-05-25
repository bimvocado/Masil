const commentService = require('../services/comment.service');

const getComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await commentService.getComments(postId);
    return res.status(200).json({
      success: true,
      message: '댓글 조회 성공',
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

const createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId, text } = req.body;
    const comment = await commentService.createComment(postId, userId, text);
    return res.status(201).json({
      success: true,
      message: '댓글 작성 성공',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const comment = await commentService.updateComment(commentId, text);
    return res.status(200).json({
      success: true,
      message: '댓글 수정 성공',
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    await commentService.deleteComment(commentId);
    return res.status(200).json({
      success: true,
      message: '댓글 삭제 성공',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getComments, createComment, updateComment, deleteComment };