const express = require('express')
const router = express.Router();
const postController = require('../controllers/post.controller');

// 게시글 등록
router.post('/', postController.createPost);

// 게시글 전체 조회
router.get('/', postController.getPosts);

// 게시글 개별 조회
router.get('/:postId', postController.getPost);

// 게시글 삭제
router.delete('/:postId', postController.deletePost);

// 게시글 수정
router.patch('/:postId', postController.updatePost);

module.exports = router;