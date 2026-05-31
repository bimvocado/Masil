const postRepository = require('../repositories/post.repository');
const Stuff = require('../models/stuff.model');

const {
    PostResDTO
} = require('../dtos/post.dto');

// 게시글 등록
const createPost = async (createPostReqDTO) => {
    const {
        content,
        imageUrl,
        userId,
        stuffId,
    } = createPostReqDTO;

    // 기본 검증
    if (!content) {
        throw new Error('내용을 입력해주세요.')
    }

    // 상품 존재 확인
    const stuff = await Stuff.findByPk(stuffId);

    if(!stuff) {
        throw new Error('존재하지 않는 상품입니다.');
    }

    // 게시글 생성
    const newPost = await postRepository.createPost({
        content,
        imageUrl,
        userId,
        stuffId
    });

    // 응답 dto 반환
    return new PostResDTO(newPost);
};

// 게시글 전체 조회 
const getPosts = async (viewerId = null) => { 
  const posts = await postRepository.findAllPosts(viewerId);
  return posts.map((post) => ({
    postId: post.postId,
    userId: post.userId,
    stuffId: post.stuffId,
    content: post.content,
    imageUrl: post.imageUrl,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    nickname: post.nickname,
    profileImageUrl: post.profileImageUrl,
    stuffName: post.stuffName,
    price: Number(post.price || 0),
    brandId: post.brandId,
    brandName: post.brandName,
    commentCount: Number(post.commentCount || 0),
    likeCount: Number(post.likeCount || 0),
    dislikeCount: Number(post.dislikeCount || 0),
    isLiked: !!post.isLiked,    
    isDisliked: !!post.isDisliked,
    scrapCount: Number(post.scrapCount || 0),
    isScrapped: !!post.isScrapped,
  }));
};

// 게시글 개별 조회
const getPost = async (postId) => {
    const post = await postRepository.findPostById(postId);

    if (!post) {
        throw new Error('존재하지 않는 게시글입니다.');
    }

    return new PostResDTO(post);
}


// 게시글 수정
const updatePost = async (
    postId,
    userId,
    updatePostReqDTO
) => {

    // 게시글 조회
    const post = await postRepository.findPostById(postId);

    if (!post) {
        throw new Error('존재하지 않는 게시글입니다.');
    }

    // 권한 체크
    if (post.userId !== userId) {
        throw new Error('게시글 수정 권한이 없습니다.');
    }

    // 수정
    await postRepository.updatePost(post, {
        content: updatePostReqDTO.content,
        imageUrl: updatePostReqDTO.imageUrl
    });

    return new PostResDTO(post);
}

// 게시글 삭제
const deletePost = async (postId, userId) => {

    // 게시글 조회
    const post = await postRepository.findPostById(postId);

    if (!post) {
        throw new Error('존재하지 않는 게시글입니다.');
    }

    // 권한 체크
    if (post.userId !== userId) {
        throw new Error('게시글 삭제 권한이 없습니다.');
    }

    // soft delete
    await postRepository.deletePost(post);

    return { message: '게시글이 삭제되었습니다.' };
};


// 사용자별 게시글 조회
const getUserPosts = async (userId, viewerId = null) => {
  const posts = await postRepository.findPostsByUserId(userId, viewerId);
  
  return posts.map((post) => ({
    postId: post.postId,
    userId: post.userId,
    stuffId: post.stuffId,
    content: post.content,
    imageUrl: post.imageUrl,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    
    nickname: post.nickname,
    profileImageUrl: post.profileImageUrl,
    
    stuffName: post.stuffName,
    price: Number(post.price || 0),
    
    brandId: post.brandId,
    brandName: post.brandName,
    
    commentCount: Number(post.commentCount || 0),
    likeCount: Number(post.likeCount || 0),
    dislikeCount: Number(post.dislikeCount || 0),

    isLiked: !!post.isLiked,    
  isDisliked: !!post.isDisliked,
  
    scrapCount: Number(post.scrapCount || 0),
    isScrapped: !!post.isScrapped,
  }));
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getUserPosts,
};