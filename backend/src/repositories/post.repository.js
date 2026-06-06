const Post = require('../models/post.model');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

// 게시글 생성 (options 추가로 서비스단 트랜잭션 수신 가능하게 보장)
const createPost = async (postData, options = {}) => {
    return await Post.create(postData, options);
};

// 게시글 전체 조회
const findAllPosts = async (viewerId = null) => {
    const posts = await sequelize.query(`
        SELECT
            p.post_id AS postId,
            p.user_id AS userId,
            p.stuff_id AS stuffId,
            p.content AS content,
            p.image_url AS imageUrl,
            p.created_at AS createdAt,
            p.updated_at AS updatedAt,
            
            -- 💰 [확정] 무거운 실시간 AVG 연산 제거! 트랜잭션으로 항시 최신화되는 stuffs 테이블의 price를 그대로 신뢰합니다.
            st.price AS price,

            u.nickname AS nickname,
            u.profile_image_url AS profileImageUrl,
            st.stuff_name AS stuffName,
            b.brand_id AS brandId,
            b.brand_name AS brandName,
            b.logo_url AS brandLogoUrl,

            p.recommended_stuff_id AS recommendedStuffId,
            p.recommended_image_url AS recommendedImageUrl,
            rst.stuff_name AS recommendedStuffName,
            
            -- 💰 추천 조합 상품의 단가도 실시간 계산 없이 캐싱된 데이터로 정직하게 가져옵니다.
            rst.price AS recommendedPrice, 
            
            rb.brand_id AS recommendedBrandId,
            rb.brand_name AS recommendedBrandName,
            rb.logo_url AS recommendedBrandLogoUrl,
            
            MAX(CASE WHEN i.user_id = :viewerId AND i.reaction_type = 'LIKE' THEN 1 ELSE 0 END) = 1 AS isLiked,
            MAX(CASE WHEN i.user_id = :viewerId AND i.reaction_type = 'DISLIKE' THEN 1 ELSE 0 END) = 1 AS isDisliked,
            
            COUNT(DISTINCT c.comment_id) AS commentCount,
            COUNT(DISTINCT CASE WHEN i.reaction_type = 'LIKE' THEN i.interaction_id END) AS likeCount,
            COUNT(DISTINCT CASE WHEN i.reaction_type = 'DISLIKE' THEN i.interaction_id END) AS dislikeCount,
            
            COUNT(DISTINCT s.scrap_id) AS scrapCount,
            CASE WHEN su.scrap_id IS NOT NULL THEN TRUE ELSE FALSE END AS isScrapped
            
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.user_id
        LEFT JOIN stuffs st ON p.stuff_id = st.stuff_id
        LEFT JOIN brands b ON st.brand_id = b.brand_id

        LEFT JOIN stuffs rst ON p.recommended_stuff_id = rst.stuff_id
        LEFT JOIN brands rb ON rst.brand_id = rb.brand_id
        
        LEFT JOIN comments c ON p.post_id = c.post_id AND c.deleted_at IS NULL
        LEFT JOIN interactions i ON p.stuff_id = i.stuff_id AND i.deleted_at IS NULL
        
        LEFT JOIN post_scraps s ON p.post_id = s.post_id AND s.deleted_at IS NULL
        LEFT JOIN post_scraps su ON p.post_id = su.post_id AND su.user_id = :viewerId AND su.deleted_at IS NULL
        
        WHERE p.deleted_at IS NULL
        
        GROUP BY 
            p.post_id, 
            u.user_id, 
            st.stuff_id, 
            b.brand_id, 
            rst.stuff_id, 
            rb.brand_id, 
            su.scrap_id
            
        ORDER BY p.created_at DESC
    `, {
        replacements: { viewerId: viewerId || 0 }, 
        type: QueryTypes.SELECT
    });
    
    return posts;
};

// 게시글 개별 상세 조회
const findPostById = async (postId) => {
    const posts = await sequelize.query(`
        SELECT
            p.post_id AS postId,
            p.user_id AS userId,
            p.stuff_id AS stuffId,
            p.content AS content,
            p.image_url AS imageUrl,
            p.recommended_stuff_id AS recommendedStuffId,
            p.recommended_image_url AS recommendedImageUrl,
            
            -- 💰 개별 단건 뷰에서도 서브쿼리를 완전히 배제하고 트랜잭션 완료된 평균 단가 테이블 매핑
            st.price AS price, 
            
            p.created_at AS createdAt,
            p.updated_at AS updatedAt,

            u.nickname AS nickname,
            u.profile_image_url AS profileImageUrl,

            st.stuff_name AS stuffName,
            b.brand_id AS brandId,
            b.brand_name AS brandName,
            b.logo_url AS brandLogoUrl,

            rst.stuff_name AS recommendedStuffName,
            
            -- 💰 추천 상품 캐싱 단가 정상 노출
            rst.price AS recommendedPrice, 
            
            rb.brand_id AS recommendedBrandId,
            rb.brand_name AS recommendedBrandName,
            rb.logo_url AS recommendedBrandLogoUrl

        FROM posts p
        LEFT JOIN users u ON p.user_id = u.user_id
        LEFT JOIN stuffs st ON p.stuff_id = st.stuff_id
        LEFT JOIN brands b ON st.brand_id = b.brand_id

        LEFT JOIN stuffs rst ON p.recommended_stuff_id = rst.stuff_id
        LEFT JOIN brands rb ON rst.brand_id = rb.brand_id

        WHERE p.post_id = :postId
          AND p.deleted_at IS NULL

        LIMIT 1
    `, {
        replacements: { postId },
        type: QueryTypes.SELECT
    });

    return posts[0] || null;
};

// 게시글 수정 및 삭제 (options 추가로 트랜잭션 전파 보장)
const updatePost = async (post, updateData, options = {}) => {
    return await post.update(updateData, options);
};

const deletePost = async (post, options = {}) => {
    return await post.destroy(options);
};

// 특정 유저의 게시글 피드 조회
const findPostsByUserId = async (userId, viewerId = null) => {
    const posts = await sequelize.query(`
        SELECT
            p.post_id AS postId,
            p.user_id AS userId,
            p.stuff_id AS stuffId,
            p.content AS content,
            p.image_url AS imageUrl,
            p.created_at AS createdAt,
            p.updated_at AS updatedAt,
            
            -- 💰 유저 피드 전용 쿼리도 무거운 AVG 제거 후 연동
            st.price AS price,

            u.nickname AS nickname,
            u.profile_image_url AS profileImageUrl,
            st.stuff_name AS stuffName,
            b.brand_id AS brandId,
            b.brand_name AS brandName,
            b.logo_url AS brandLogoUrl,

            p.recommended_stuff_id AS recommendedStuffId,
            p.recommended_image_url AS recommendedImageUrl,
            rst.stuff_name AS recommendedStuffName,
            
            -- 💰 추천 조합 상품 평균 가격
            rst.price AS recommendedPrice, 
            
            rb.brand_id AS recommendedBrandId,
            rb.brand_name AS recommendedBrandName,
            rb.logo_url AS recommendedBrandLogoUrl,

            MAX(CASE WHEN i.user_id = :viewerId AND i.reaction_type = 'LIKE' THEN 1 ELSE 0 END) = 1 AS isLiked,
            MAX(CASE WHEN i.user_id = :viewerId AND i.reaction_type = 'DISLIKE' THEN 1 ELSE 0 END) = 1 AS isDisliked,
            
            COUNT(DISTINCT c.comment_id) AS commentCount,
            COUNT(DISTINCT CASE WHEN i.reaction_type = 'LIKE' THEN i.interaction_id END) AS likeCount,
            COUNT(DISTINCT CASE WHEN i.reaction_type = 'DISLIKE' THEN i.interaction_id END) AS dislikeCount,
            COUNT(DISTINCT s.scrap_id) AS scrapCount,
            CASE WHEN su.scrap_id IS NOT NULL THEN TRUE ELSE FALSE END AS isScrapped
            
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.user_id
        LEFT JOIN stuffs st ON p.stuff_id = st.stuff_id
        LEFT JOIN brands b ON st.brand_id = b.brand_id

        LEFT JOIN stuffs rst ON p.recommended_stuff_id = rst.stuff_id
        LEFT JOIN brands rb ON rst.brand_id = rb.brand_id
        
        LEFT JOIN comments c ON p.post_id = c.post_id AND c.deleted_at IS NULL
        LEFT JOIN interactions i ON p.stuff_id = i.stuff_id AND i.deleted_at IS NULL
        LEFT JOIN post_scraps s ON p.post_id = s.post_id AND s.deleted_at IS NULL
        LEFT JOIN post_scraps su ON p.post_id = su.post_id AND su.user_id = :viewerId AND su.deleted_at IS NULL
        
        WHERE p.user_id = :userId AND p.deleted_at IS NULL
        
        GROUP BY 
            p.post_id, 
            u.user_id, 
            st.stuff_id, 
            b.brand_id, 
            rst.stuff_id, 
            rb.brand_id, 
            su.scrap_id
            
        ORDER BY p.created_at DESC
    `, {
        replacements: { userId, viewerId: viewerId || 0 },
        type: QueryTypes.SELECT
    });
    
    return posts;
};

// 💡 [서비스 트랜잭션 동기화용 핵심 함수] 
// 포스트 CUD 발생 후 서비스단에서 이 쿼리를 호출해 stuffs 테이블의 price를 원천 업데이트합니다.
const getAveragePriceByStuffId = async (stuffId, options = {}) => {
  const result = await sequelize.query(`
    SELECT ROUND(AVG(price)) AS averagePrice
    FROM posts
    WHERE stuff_id = :stuffId
      AND price IS NOT NULL
      AND deleted_at IS NULL
  `, {
    replacements: { stuffId },
    type: QueryTypes.SELECT,
    ...options // 트랜잭션 컨텍스트 전파
  });

  return result[0]?.averagePrice || 0;
};

module.exports = {
    createPost,
    findPostById,
    updatePost,
    deletePost,
    findAllPosts,
    findPostsByUserId,
    getAveragePriceByStuffId,
};