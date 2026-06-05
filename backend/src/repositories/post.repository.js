const Post = require('../models/post.model');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

// 게시글 생성 (options 추가로 트랜잭션 수신 가능하게 변경)
const createPost = async (postData, options = {}) => {
    return await Post.create(postData, options);
};

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
            p.price AS price,

            u.nickname AS nickname,
            u.profile_image_url AS profileImageUrl,
            st.stuff_name AS stuffName,
            b.brand_id AS brandId,
            b.brand_name AS brandName,

            p.recommended_stuff_id AS recommendedStuffId,
            p.recommended_image_url AS recommendedImageUrl,
            rst.stuff_name AS recommendedStuffName,
            rb.brand_id AS recommendedBrandId,
            rb.brand_name AS recommendedBrandName,
            
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
            p.price AS price,
            p.created_at AS createdAt,
            p.updated_at AS updatedAt,

            u.nickname AS nickname,
            u.profile_image_url AS profileImageUrl,

            st.stuff_name AS stuffName,
            b.brand_id AS brandId,
            b.brand_name AS brandName,

            rst.stuff_name AS recommendedStuffName,
            rb.brand_id AS recommendedBrandId,
            rb.brand_name AS recommendedBrandName

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

const updatePost = async (post, updateData) => {
    return await post.update(updateData);
};

const deletePost = async (post) => {
    return await post.destroy();
};

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
            p.price AS price,

            u.nickname AS nickname,
            u.profile_image_url AS profileImageUrl,
            st.stuff_name AS stuffName,
            b.brand_id AS brandId,
            b.brand_name AS brandName,

            p.recommended_stuff_id AS recommendedStuffId,
            p.recommended_image_url AS recommendedImageUrl,
            rst.stuff_name AS recommendedStuffName,
            rb.brand_id AS recommendedBrandId,
            rb.brand_name AS recommendedBrandName,

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

const getAveragePriceByStuffId = async (stuffId) => {
  const result = await sequelize.query(`
    SELECT ROUND(AVG(price)) AS averagePrice
    FROM posts
    WHERE stuff_id = :stuffId
      AND price IS NOT NULL
      AND deleted_at IS NULL
  `, {
    replacements: { stuffId },
    type: QueryTypes.SELECT
  });

  return result[0]?.averagePrice || null;
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