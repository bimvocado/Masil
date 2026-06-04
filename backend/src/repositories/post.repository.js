const Post = require('../models/post.model');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

// 게시글 생성
const createPost = async (postData) => {
  return await Post.create(postData);
};

// 수정/삭제용 게시글 모델 조회
const findPostModelById = async (postId) => {
  return await Post.findOne({
    where: {
      postId,
    },
  });
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

      -- 게시글에 저장된 가격 가져와야 됨.
      p.price AS price,

      u.nickname AS nickname,
      u.profile_image_url AS profileImageUrl,
      st.stuff_name AS stuffName,
      b.brand_id AS brandId,
      b.brand_name AS brandName,

      -- 추천 조합 상품 정보
      p.recommended_stuff_id AS recommendedStuffId,
      p.recommended_image_url AS recommendedImageUrl,
      rst.stuff_name AS recommendedStuffName,
      rb.brand_id AS recommendedBrandId,
      rb.brand_name AS recommendedBrandName,
      
      -- 💡 [옳소/싫소] 로직: stuffId 기준으로 '나(viewerId)'의 상태를 확인!
      MAX(CASE WHEN i.user_id = :viewerId AND i.reaction_type = 'LIKE' THEN 1 ELSE 0 END) = 1 AS isLiked,
      MAX(CASE WHEN i.user_id = :viewerId AND i.reaction_type = 'DISLIKE' THEN 1 ELSE 0 END) = 1 AS isDisliked,
      
      -- 💡 [카운트 통계]
      COUNT(DISTINCT c.comment_id) AS commentCount,
      COUNT(DISTINCT CASE WHEN i.reaction_type = 'LIKE' THEN i.interaction_id END) AS likeCount,
      COUNT(DISTINCT CASE WHEN i.reaction_type = 'DISLIKE' THEN i.interaction_id END) AS dislikeCount,
      
      -- 💡 [스크랩] 로직: 이건 게시글(postId) 기준!
      COUNT(DISTINCT s.scrap_id) AS scrapCount,
      CASE WHEN su.scrap_id IS NOT NULL THEN TRUE ELSE FALSE END AS isScrapped
      
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.user_id
    LEFT JOIN stuffs st ON p.stuff_id = st.stuff_id
    LEFT JOIN brands b ON st.brand_id = b.brand_id

    -- 추천 조합 상품 정보
    LEFT JOIN stuffs rst ON p.recommended_stuff_id = rst.stuff_id
    LEFT JOIN brands rb ON rst.brand_id = rb.brand_id
    
    LEFT JOIN comments c ON p.post_id = c.post_id AND c.deleted_at IS NULL
    -- 💡 핵심: i.stuff_id = p.stuff_id (옳소/싫소 공유의 심장)
    LEFT JOIN interactions i ON p.stuff_id = i.stuff_id AND i.deleted_at IS NULL
    
    LEFT JOIN post_scraps s ON p.post_id = s.post_id AND s.deleted_at IS NULL
    LEFT JOIN post_scraps su ON p.post_id = su.post_id AND su.user_id = :viewerId AND su.deleted_at IS NULL
    
    WHERE p.deleted_at IS NULL
    
    GROUP BY 
      p.post_id,
      p.user_id,
      p.stuff_id,
      p.content,
      p.image_url,
      p.recommended_stuff_id,
      p.recommended_image_url,
      p.price,
      p.created_at,
      p.updated_at,
      u.user_id,
      u.nickname,
      u.profile_image_url,
      st.stuff_id,
      st.stuff_name,
      b.brand_id,
      b.brand_name,
      rst.stuff_id,
      rst.stuff_name,
      rb.brand_id,
      rb.brand_name,
      su.scrap_id
      
    ORDER BY p.created_at DESC
  `, {
    replacements: { viewerId: viewerId || 0 },
    type: QueryTypes.SELECT
  });

  return posts;
};

// 게시글 개별 조회
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

    -- 추천 조합 상품 정보
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

// 게시글 수정
const updatePost = async (post, updateData) => {
  return await post.update(updateData);
};

// 게시글 삭제 (soft delete), 게시글 DELETE가 아니라 deletedAt 값을 채워줌!
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

      -- 게시글에 저장된 가격 가져와야 됨.
      p.price AS price,

      u.nickname AS nickname,
      u.profile_image_url AS profileImageUrl,
      st.stuff_name AS stuffName,
      b.brand_id AS brandId,
      b.brand_name AS brandName,

      -- 추천 조합 상품 정보
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

    -- 추천 조합 상품 정보
    LEFT JOIN stuffs rst ON p.recommended_stuff_id = rst.stuff_id
    LEFT JOIN brands rb ON rst.brand_id = rb.brand_id
    
    LEFT JOIN comments c ON p.post_id = c.post_id AND c.deleted_at IS NULL
    LEFT JOIN interactions i ON p.stuff_id = i.stuff_id AND i.deleted_at IS NULL
    LEFT JOIN post_scraps s ON p.post_id = s.post_id AND s.deleted_at IS NULL
    LEFT JOIN post_scraps su ON p.post_id = su.post_id AND su.user_id = :viewerId AND su.deleted_at IS NULL
    
    WHERE p.user_id = :userId
      AND p.deleted_at IS NULL
    
    GROUP BY 
      p.post_id,
      p.user_id,
      p.stuff_id,
      p.content,
      p.image_url,
      p.recommended_stuff_id,
      p.recommended_image_url,
      p.price,
      p.created_at,
      p.updated_at,
      u.user_id,
      u.nickname,
      u.profile_image_url,
      st.stuff_id,
      st.stuff_name,
      b.brand_id,
      b.brand_name,
      rst.stuff_id,
      rst.stuff_name,
      rb.brand_id,
      rb.brand_name,
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
  findPostModelById,
  findPostById,
  updatePost,
  deletePost,
  findAllPosts,
  findPostsByUserId,
  getAveragePriceByStuffId,
};