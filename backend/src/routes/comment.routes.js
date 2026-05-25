 const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

// 댓글 목록 조회
router.get('/:postId/comments', commentController.getCommentsByPostId);

// 댓글 작성
router.post('/:postId/comments', commentController.createComment);

// 댓글 수정
router.put('/comments/:commentId', commentController.updateComment);

// 댓글 삭제
router.delete('/comments/:commentId', commentController.deleteComment);

module.exports = router;