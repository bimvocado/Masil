const postService = require('../services/post.service');
const ApiResponse = require('../utils/api.response.util');
const { CreatePostReqDTO, UpdatePostReqDTO } = require('../dtos/post.dto');

// 게시글 등록 (등록 시 해당 stuff의 평균 가격 트랜잭션 반영 유도)
const createPost = async (req, res, next) => {
  try {
    const { 
      content, 
      brandId, 
      stuffName, 
      price, 
      recommendedBrandId, 
      recommendedStuffName, 
      recommendedPrice 
    } = req.body;
    
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    const userId = req.user.userId;

    const imageUrl = (req.files && req.files.image && req.files.image[0])
      ? `/uploads/${req.files.image[0].filename}`
      : null;

    const recommendedImageUrl = (req.files && req.files.recommendedImage && req.files.recommendedImage[0])
      ? `/uploads/${req.files.recommendedImage[0].filename}`
      : null;

    const reqDTO = new CreatePostReqDTO(
      content,
      imageUrl,
      userId,
      recommendedImageUrl,
      brandId,
      stuffName,
      price,
      recommendedBrandId,
      recommendedStuffName,
      recommendedPrice
    );

    // 🔥이 내부에서 새 포스트 가격 기준 stuff 테이블 price 업데이트 트랜잭션 실행
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
    return res.status(200).json(ApiResponse.success(200, '게시글 전체 조회 성공', posts));
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
    return res.status(200).json(ApiResponse.success(200, '게시글 조회 성공', post));
  } catch (error) {
    next(error);
  }
};

// 게시글 수정 (가격 수정 시 stuff 테이블 price 평균값 재정산 트랜잭션 유도)
const updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content, imageUrl, price, recommendedStuffId } = req.body;
    const userId = req.user.userId;

    const reqDTO = new UpdatePostReqDTO(content, imageUrl, price, recommendedStuffId);
    
    // 🔥수정된 가격 반영 후 stuff 테이블 price 평균값 재계산 트랜잭션 처리
    const updateResult = await postService.updatePost(Number(postId), userId, reqDTO);
    return res.status(200).json(ApiResponse.success(200, '게시글 수정 성공', updateResult));
  } catch (error) {
    next(error);
  }
};

// 게시글 삭제 (삭제 시 해당 stuff의 평균 가격 재정산 트랜잭션 유도)
const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;
    
    // 🔥리뷰 삭제로 인해 원본 stuff의 평균 price가 재정산되는 트랜잭션이 실행됨
    const deleteResult = await postService.deletePost(Number(postId), userId);
    return res.status(200).json(ApiResponse.success(200, '게시글 삭제 성공', deleteResult));
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