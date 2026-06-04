const postService = require('../services/post.service');
const ApiResponse = require('../utils/api.response.util');

const {
  CreatePostReqDTO,
  UpdatePostReqDTO
} = require('../dtos/post.dto');

// 게시글 등록
const createPost = async (req, res, next) => {
  try {
    const { content, stuffId, price, recommendedStuffId } = req.body;
    
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    const userId = req.user.userId;

    const imageUrl = req.files?.image
      ? `/uploads/${req.files.image[0].filename}`
      : null;

    const recommendedImageUrl = req.files?.recommendedImage
      ? `/uploads/${req.files.recommendedImage[0].filename}`
      : null;

    const reqDTO = new CreatePostReqDTO(
      content,
      imageUrl,
      userId,
      stuffId,
      price,
      recommendedStuffId,
      recommendedImageUrl
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
    const viewerId = req.user ? req.user.userId : null;

    const posts = await postService.getPosts(viewerId); 

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
    const viewerId = req.user ? req.user.userId : null; 

    const post = await postService.getPost(Number(postId), viewerId); 

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
    const { content, imageUrl, price, recommendedStuffId } = req.body;

    const userId = req.user.userId;

    const reqDTO = new UpdatePostReqDTO(
      content,
      imageUrl,
      price,
      recommendedStuffId
    );

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

    const userId = req.user.userId;

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