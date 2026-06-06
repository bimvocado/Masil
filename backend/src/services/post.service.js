const postRepository = require('../repositories/post.repository');
const stuffRepository = require('../repositories/stuff.repository'); // 💰 평균가 컬럼 업데이트를 위해 추가
const Stuff = require('../models/stuff.model');
const sequelize = require('../config/db'); 
const { PostResDTO } = require('../dtos/post.dto');

// 🌟 게시글 등록 (자동완성 로직 100% 보존 + 실시간 완벽 동기화)
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

        // 1. [자동완성 원천 유지] 메인 상품 등록 또는 기존 상품 조회
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

        // 2. [자동완성 원천 유지] 추천 상품 등록 또는 기존 상품 조회
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

        // 3. 게시글 생성
        const newPost = await postRepository.createPost({
            content,
            imageUrl,
            userId,
            stuffId: finalStuffId,
            price: Number(price) || 0,
            recommendedStuffId: finalRecommendedStuffId,
            recommendedImageUrl,
        }, { transaction: t }); 

        // 💰 [캐싱 동기화] 게시글 생성 완료 후 레포지토리 공통 함수를 사용해 수식 계산 후 직계 컬럼 반영
        // [A] 메인 상품 실시간 평균가 계산 및 stuffs 테이블 업데이트
        const newAvgPrice = await postRepository.getAveragePriceByStuffId(finalStuffId, { transaction: t });
        await stuffRepository.updateStuffAveragePrice(finalStuffId, newAvgPrice, { transaction: t });

        // [B] 추천 상품 실시간 평균가 계산 및 stuffs 테이블 업데이트
        if (finalRecommendedStuffId) {
            const newRecAvgPrice = await postRepository.getAveragePriceByStuffId(finalRecommendedStuffId, { transaction: t });
            await stuffRepository.updateStuffAveragePrice(finalRecommendedStuffId, newRecAvgPrice, { transaction: t });
        }

        await t.commit();
        
        // 새로 생성된 post 객체의 id로 온전한 데이터를 다시 한 번 빌드해서 반환
        const completePost = await postRepository.findPostById(newPost.postId);
        return new PostResDTO(completePost);

    } catch (error) {
        await t.rollback();
        console.error('게시글 등록 트랜잭션 롤백 완료:', error);
        throw error;
    }
};

// 게시글 리스트 조회
const getPosts = async (viewerId = null) => { 
  const posts = await postRepository.findAllPosts(viewerId);
  return posts.map((post) => ({
    postId: post.postId,
    userId: post.userId,
    stuffId: post.stuffId,
    content: post.content,
    imageUrl: post.imageUrl,
    price: post.price === null || post.price === undefined ? 0 : Number(post.price), 

    recommendedStuffId: post.recommendedStuffId,
    recommendedStuffName: post.recommendedStuffName,
    recommendedPrice: post.recommendedPrice === null || post.recommendedPrice === undefined ? 0 : Number(post.recommendedPrice),
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

// 단건 조회
const getPost = async (postId, viewerId = null) => {
    const post = await postRepository.findPostById(postId, viewerId);
    if (!post) throw new Error('존재하지 않는 게시글입니다.');
    
    return new PostResDTO(post);
};

// 🌟 게시글 수정 (가격 변동 가능성이 크므로 동일하게 재정산 트랜잭션 추가)
const updatePost = async (postId, userId, updatePostReqDTO) => {
    const t = await sequelize.transaction();
    try {
        // Raw Query 데이터와 오리지널 인스턴스 검증을 위해 단건 조회
        const postData = await postRepository.findPostById(postId);
        if (!postData) throw new Error('존재하지 않는 게시글입니다.');
        if (Number(postData.userId) !== Number(userId)) throw new Error('게시글 수정 권한이 없습니다.');

        // 실제 대상을 영속성 모델로 취득
        const postInstance = await Post.findByPk(postId, { transaction: t });

        // 업데이트 단행
        await postRepository.updatePost(postInstance, {
            content: updatePostReqDTO.content,
            imageUrl: updatePostReqDTO.imageUrl,
            price: Number(updatePostReqDTO.price) || 0,
            recommendedStuffId: updatePostReqDTO.recommendedStuffId,
        }, { transaction: t });

        // 💰 [동기화 추가] 수정으로 인해 파괴되거나 변동된 평균 단가를 양쪽 다 업데이트
        const mainAvg = await postRepository.getAveragePriceByStuffId(postData.stuffId, { transaction: t });
        await stuffRepository.updateStuffAveragePrice(postData.stuffId, mainAvg, { transaction: t });

        if (updatePostReqDTO.recommendedStuffId) {
            const recAvg = await postRepository.getAveragePriceByStuffId(updatePostReqDTO.recommendedStuffId, { transaction: t });
            await stuffRepository.updateStuffAveragePrice(updatePostReqDTO.recommendedStuffId, recAvg, { transaction: t });
        }

        await t.commit();
        const updatedPost = await postRepository.findPostById(postId);
        return new PostResDTO(updatedPost);
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

// 🌟 게시글 삭제 (해당 포스트의 단가가 빠지므로 실시간 마이너스 정산 필수)
const deletePost = async (postId, userId) => {
    const t = await sequelize.transaction();
    try {
        const postData = await postRepository.findPostById(postId);
        if (!postData) throw new Error('존재하지 않는 게시글입니다.');
        if (Number(postData.userId) !== Number(userId)) throw new Error('게시글 삭제 권한이 없습니다.');

        const postInstance = await Post.findByPk(postId, { transaction: t });
        await postRepository.deletePost(postInstance, { transaction: t });

        // 💰 [동기화 추가] 이 포스트의 가격이 빠진 상태의 새로운 평균값을 구해 반영
        const mainAvg = await postRepository.getAveragePriceByStuffId(postData.stuffId, { transaction: t });
        await stuffRepository.updateStuffAveragePrice(postData.stuffId, mainAvg, { transaction: t });

        if (postData.recommendedStuffId) {
            const recAvg = await postRepository.getAveragePriceByStuffId(postData.recommendedStuffId, { transaction: t });
            await stuffRepository.updateStuffAveragePrice(postData.recommendedStuffId, recAvg, { transaction: t });
        }

        await t.commit();
        return { message: '게시글이 삭제되었습니다.' };
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

// 유저 피드 리스트 조회
const getUserPosts = async (userId, viewerId = null) => {
  const posts = await postRepository.findPostsByUserId(userId, viewerId);
  return posts.map((post) => ({
    postId: post.postId,
    userId: post.userId,
    stuffId: post.stuffId,
    content: post.content,
    imageUrl: post.imageUrl,
    price: post.price === null || post.price === undefined ? 0 : Number(post.price), 

    recommendedStuffId: post.recommendedStuffId,
    recommendedStuffName: post.recommendedStuffName,
    recommendedPrice: post.recommendedPrice === null || post.recommendedPrice === undefined ? 0 : Number(post.recommendedPrice),
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