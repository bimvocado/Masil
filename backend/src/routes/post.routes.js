const express = require('express')
const router = express.Router();
const postController = require('../controllers/post.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload');

// 게시글 등록
router.post('/', authMiddleware, upload.single('image'), postController.createPost);

// 게시글 전체 조회
router.get('/', authMiddleware, postController.getPosts);

// 게시글 개별 조회
router.get('/:postId', authMiddleware, postController.getPost);

// 게시글 삭제
router.delete('/:postId', authMiddleware, postController.deletePost);

// 게시글 수정
router.patch('/:postId', authMiddleware, postController.updatePost);

module.exports = router;