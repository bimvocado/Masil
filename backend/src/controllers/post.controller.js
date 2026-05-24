const postService = require('../services/post.service');
const ApiResponse = require('../utils/api-response.util');

const {
  CreatePostReqDTO,
  UpdatePostReqDTO
} = require('../dtos/post.dto');

// 게시글 등록
const createPost = async (req, res, next) => {
  try {
    const { content, imageUrl, stuffId } = req.body;

    const userId = req.user.user.userId;

    const reqDTO = new CreatePostReqDTO(
      content,
      imageUrl,
      userId,
      stuffId
    );

    const postResult = await postService.createPost(reqDTO);

    return res.status(201).json(
      ApiResponse.success(201, '게시글 등록 성공', postResult)
    );
  } catch (error) {
    next(error);
  }
};

// 게시글 전체 조회
const getPosts = async (req, res, next) => {
  try {
    const posts = await postService.getPosts();

    return res.status(200).json(
      ApiResponse.success(200, '게시글 전체 조회 성공', posts)
    );
  } catch (error) {
    next(error);
  }
};

// 게시글 개별 조회
const getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await postService.getPost(Number(postId));

    return res.status(200).json(
      ApiResponse.success(200, '게시글 조회 성공', post)
    );
  } catch (error) {
    next(error);
  }
};

// 게시글 수정
const updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content, imageUrl } = req.body;

    const userId = req.user.user.userId;

    const reqDTO = new UpdatePostReqDTO(content, imageUrl);

    const updateResult = await postService.updatePost(
      Number(postId),
      userId,
      reqDTO
    );

    return res.status(200).json(
      ApiResponse.success(200, '게시글 수정 성공', updateResult)
    );
  } catch (error) {
    next(error);
  }
};

// 게시글 삭제
const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const userId = req.user.user.userId;

    const deleteResult = await postService.deletePost(
      Number(postId),
      userId
    );

    return res.status(200).json(
      ApiResponse.success(200, '게시글 삭제 성공', deleteResult)
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};