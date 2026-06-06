const postRepository = require('../repositories/post.repository');
const Stuff = require('../models/stuff.model');
const sequelize = require('../config/db'); 
const { PostResDTO } = require('../dtos/post.dto');

// 게시글 등록 (트랜잭션 및 자동 분기 로직 적용)
const createPost = async (createPostReqDTO) => {
    const {
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
    } = createPostReqDTO;

    if (!content) {
        throw new Error('내용을 입력해주세요.');
    }

    const t = await sequelize.transaction();

    try {
        let finalStuffId = null;
        let finalRecommendedStuffId = null;

        if (stuffName && brandId) {
            const cleanStuffName = stuffName.replace('@', '').trim();
            
            const existingStuff = await Stuff.findOne({
                where: { brandId, stuffName: cleanStuffName },
                transaction: t 
            });

            if (existingStuff) {
                finalStuffId = existingStuff.stuffId;
            } else {
                const newStuff = await Stuff.create({
                    brandId,
                    stuffName: cleanStuffName,
                    price: Number(price) || 0
                }, { transaction: t });
                finalStuffId = newStuff.stuffId;
            }
        }

        if (!finalStuffId) {
            throw new Error('메인 상품 정보가 구성되지 않았습니다.');
        }

        if (recommendedStuffName && recommendedBrandId) {
            const cleanRecName = recommendedStuffName.replace('@', '').trim();

            const existingRecStuff = await Stuff.findOne({
                where: { brandId: recommendedBrandId, stuffName: cleanRecName },
                transaction: t
            });

            if (existingRecStuff) {
                finalRecommendedStuffId = existingRecStuff.stuffId;
            } else {
                const newRecStuff = await Stuff.create({
                    brandId: recommendedBrandId,
                    stuffName: cleanRecName,
                    price: Number(recommendedPrice) || 0
                }, { transaction: t });
                finalRecommendedStuffId = newRecStuff.stuffId;
            }
        }

        const newPost = await postRepository.createPost({
            content,
            imageUrl,
            userId,
            stuffId: finalStuffId,
            price: Number(price) || 0,
            recommendedStuffId: finalRecommendedStuffId,
            recommendedImageUrl,
        }, { transaction: t }); 

        await t.commit();
        return new PostResDTO(newPost);

    } catch (error) {
        await t.rollback();
        console.error('게시글 등록 트랜잭션 롤백 처리 완료:', error);
        throw error;
    }
};

const getPosts = async (viewerId = null, stuffId = null) => { 
  const posts = await postRepository.findAllPosts(viewerId, stuffId);
  return posts.map((post) => ({
    postId: post.postId,
    userId: post.userId,
    stuffId: post.stuffId,
    content: post.content,
    imageUrl: post.imageUrl,
    price: post.price === null || post.price === undefined ? null : Number(post.price),
    
    // 💰 [보완] 프론트엔드가 averagePrice와 avgPrice 둘 중 무엇을 불러도 정상 작동하도록 2개 다 꽂아줍니다.
    avgPrice: post.avgPrice ?? post.averagePrice ?? null,
    averagePrice: post.avgPrice ?? post.averagePrice ?? null,

    recommendedStuffId: post.recommendedStuffId,
    recommendedStuffName: post.recommendedStuffName,
    recommendedBrandId: post.recommendedBrandId,
    recommendedBrandName: post.recommendedBrandName,
    recommendedImageUrl: post.recommendedImageUrl,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    nickname: post.nickname,
    profileImageUrl: post.profileImageUrl,
    stuffName: post.stuffName,
    brandId: post.brandId,
    brandName: post.brandName,
    brandLogoUrl: post.brandLogoUrl,                      
    recommendedBrandLogoUrl: post.recommendedBrandLogoUrl, 
    commentCount: Number(post.commentCount || 0),
    likeCount: Number(post.likeCount || 0),
    dislikeCount: Number(post.dislikeCount || 0),
    isLiked: !!post.isLiked,    
    isDisliked: !!post.isDisliked,
    scrapCount: Number(post.scrapCount || 0),
    isScrapped: !!post.isScrapped,
  }));
};

// [수정 완료] 단일 게시글 조회
const getPost = async (postId, viewerId = null) => {
    const post = await postRepository.findPostById(postId, viewerId);
    if (!post) throw new Error('존재하지 않는 게시글입니다.');
    
    // 💰 레포지토리가 뱉은 날것의 post 객체에 평균 가격이 들어있다면 DTO에 들어가기 전에 확실히 인지시킵니다.
    const calculatedAvg = post.avgPrice ?? post.averagePrice ?? null;
    
    return {
        ...new PostResDTO(post),
        avgPrice: calculatedAvg,       // 👈 DTO 필터에 걸러져 유실되는 것을 원천 차단
        averagePrice: calculatedAvg    // 👈 프론트 기종/컴포넌트별 스펙 완벽 호환
    };
};

const updatePost = async (postId, userId, updatePostReqDTO) => {
    const post = await postRepository.findPostById(postId);
    if (!post) throw new Error('존재하지 않는 게시글입니다.');
    if (Number(post.userId) !== Number(userId)) throw new Error('게시글 수정 권한이 없습니다.');
    await postRepository.updatePost(post, {
        content: updatePostReqDTO.content,
        imageUrl: updatePostReqDTO.imageUrl,
        price: updatePostReqDTO.price,
        recommendedStuffId: updatePostReqDTO.recommendedStuffId,
    });
    return new PostResDTO(post);
};

const deletePost = async (postId, userId) => {
    const post = await postRepository.findPostById(postId);
    if (!post) throw new Error('존재하지 않는 게시글입니다.');
    if (Number(post.userId) !== Number(userId)) throw new Error('게시글 삭제 권한이 없습니다.');
    await postRepository.deletePost(post);
    return { message: '게시글이 삭제되었습니다.' };
};

const getUserPosts = async (userId, viewerId = null) => {
  const posts = await postRepository.findPostsByUserId(userId, viewerId);
  return posts.map((post) => ({
    postId: post.postId,
    userId: post.userId,
    stuffId: post.stuffId,
    content: post.content,
    imageUrl: post.imageUrl,
    price: post.price === null || post.price === undefined ? null : Number(post.price),
    
    // 💰 [보완] 유저 피드용 평균 가격도 2중 필드로 안전 장치 가동
    avgPrice: post.avgPrice ?? post.averagePrice ?? null,
    averagePrice: post.avgPrice ?? post.averagePrice ?? null,

    recommendedStuffId: post.recommendedStuffId,
    recommendedStuffName: post.recommendedStuffName,
    recommendedBrandId: post.recommendedBrandId,
    recommendedBrandName: post.recommendedBrandName,
    recommendedImageUrl: post.recommendedImageUrl,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    nickname: post.nickname,
    profileImageUrl: post.profileImageUrl,
    stuffName: post.stuffName,
    brandId: post.brandId,
    brandName: post.brandName,
    brandLogoUrl: post.brandLogoUrl,                      
    recommendedBrandLogoUrl: post.recommendedBrandLogoUrl, 
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