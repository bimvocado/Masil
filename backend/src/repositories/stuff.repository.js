const { Op, QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

const Stuff = require('../models/stuff.model');
const Brand = require('../models/brand.model');

// 검색창 - 상품으로 검색
const searchStuffs = async ({ keyword, category }) => {
  const rows = await sequelize.query(
    `
    SELECT
      s.stuff_id AS stuffId,
      s.stuff_name AS stuffName,
      s.price AS price,
      s.is_discontinued AS isDiscontinued,

      b.brand_id AS brandId,
      b.brand_name AS brandName,
      b.logo_url AS logoUrl,
      b.category AS category,

      (
        SELECT p.image_url
        FROM posts p
        LEFT JOIN post_scraps sc
          ON p.post_id = sc.post_id
          AND sc.deleted_at IS NULL
        WHERE p.stuff_id = s.stuff_id
          AND p.image_url IS NOT NULL
          AND p.image_url != ''
          AND p.deleted_at IS NULL
        GROUP BY p.post_id
        ORDER BY COUNT(sc.scrap_id) DESC, p.created_at DESC
        LIMIT 1
      ) AS imageUrl

    FROM stuffs s

    INNER JOIN brands b
      ON s.brand_id = b.brand_id
      AND b.deleted_at IS NULL

    WHERE s.deleted_at IS NULL
      AND (:keyword IS NULL OR s.stuff_name LIKE CONCAT('%', :keyword, '%'))
      AND (:category IS NULL OR b.category = :category)

    ORDER BY s.stuff_name ASC
    `,
    {
      replacements: {
        keyword: keyword || null,
        category: category || null,
      },
      type: QueryTypes.SELECT,
    }
  );

  return rows;
};

// 상품창 - 상세 페이지 전체
const findStuffDetail = async (stuffId) => {
  const rows = await sequelize.query(
    `
    SELECT
      s.stuff_id AS stuffId,
      s.stuff_name AS stuffName,
      s.price AS price,

      b.brand_id AS brandId,
      b.brand_name AS brandName,
      b.logo_url AS logoUrl,

      (
        SELECT p.image_url
        FROM posts p
        LEFT JOIN post_scraps sc
          ON p.post_id = sc.post_id
          AND sc.deleted_at IS NULL
        WHERE p.stuff_id = s.stuff_id
          AND p.image_url IS NOT NULL
          AND p.image_url != ''
          AND p.deleted_at IS NULL
        GROUP BY p.post_id
        ORDER BY COUNT(sc.scrap_id) DESC, p.created_at DESC
        LIMIT 1
      ) AS imageUrl,

      COUNT(DISTINCT CASE
        WHEN i.reaction_type = 'LIKE'
        THEN i.interaction_id
      END) AS totalLikeCount,

      COUNT(DISTINCT CASE
        WHEN i.reaction_type = 'LIKE'
          AND u.is_korean = true
        THEN i.interaction_id
      END) AS koreanLikeCount,

      COUNT(DISTINCT CASE
        WHEN i.reaction_type = 'LIKE'
          AND u.is_korean = false
        THEN i.interaction_id
      END) AS foreignerLikeCount,

      COUNT(DISTINCT CASE
        WHEN i.reaction_type = 'DISLIKE'
        THEN i.interaction_id
      END) AS totalDislikeCount,

      COUNT(DISTINCT CASE
        WHEN i.reaction_type = 'DISLIKE'
          AND u.is_korean = true
        THEN i.interaction_id
      END) AS koreanDislikeCount,

      COUNT(DISTINCT CASE
        WHEN i.reaction_type = 'DISLIKE'
          AND u.is_korean = false
        THEN i.interaction_id
      END) AS foreignerDislikeCount,

      COUNT(DISTINCT p.post_id) AS totalPostCount

    FROM stuffs s

    INNER JOIN brands b
      ON s.brand_id = b.brand_id
      AND b.deleted_at IS NULL

    LEFT JOIN interactions i
      ON s.stuff_id = i.stuff_id
      AND i.deleted_at IS NULL

    LEFT JOIN users u
      ON i.user_id = u.user_id

    LEFT JOIN posts p
      ON s.stuff_id = p.stuff_id
      AND p.deleted_at IS NULL

    WHERE s.stuff_id = :stuffId
      AND s.deleted_at IS NULL

    GROUP BY
      s.stuff_id,
      s.stuff_name,
      s.price,
      b.brand_id,
      b.brand_name,
      b.logo_url
    `,
    {
      replacements: { stuffId },
      type: QueryTypes.SELECT,
    }
  );

  return rows[0];
};

const findStuffById = async (stuffId) => {
  return await findStuffDetail(stuffId);
};

const createStuff = async ({ brandId, stuffName, price }) => {
  return await Stuff.create({
    brandId,
    stuffName,
    price,
  });
};

// 상품창 - 하단 스크랩 가장 많은 글
const findTopPostByStuff = async (stuffId) => {
  const rows = await sequelize.query(
    `
    SELECT
      p.post_id AS postId,
      p.content AS content,
      p.image_url AS imageUrl,
      p.user_id AS userId,
      u.nickname AS nickname,
      p.created_at AS createdAt,

      p.recommended_stuff_id AS recommendedStuffId,
      p.recommended_image_url AS recommendedImageUrl,
      rst.stuff_name AS recommendedStuffName,
      rb.brand_id AS recommendedBrandId,
      rb.brand_name AS recommendedBrandName,

      COUNT(sc.scrap_id) AS scrapCount

    FROM posts p

    LEFT JOIN post_scraps sc
      ON p.post_id = sc.post_id
      AND sc.deleted_at IS NULL

    LEFT JOIN users u
      ON p.user_id = u.user_id

    LEFT JOIN stuffs rst 
      ON p.recommended_stuff_id = rst.stuff_id
      AND rst.deleted_at IS NULL
    
    LEFT JOIN brands rb 
      ON rst.brand_id = rb.brand_id
      AND rb.deleted_at IS NULL

    WHERE p.stuff_id = :stuffId
      AND p.deleted_at IS NULL

    GROUP BY 
      p.post_id, 
      p.content, 
      p.image_url, 
      p.user_id, 
      u.nickname, 
      p.created_at,
      p.recommended_stuff_id,
      p.recommended_image_url,
      rst.stuff_id,
      rst.stuff_name,
      rb.brand_id,
      rb.brand_name

    ORDER BY scrapCount DESC, p.created_at DESC

    LIMIT 1
    `,
    {
      replacements: { stuffId },
      type: QueryTypes.SELECT,
    }
  );

  return rows[0];
};

// 상품 상세 페이지 - 가로 스와이프용 상위 추천 조합 최대 4개 조회 (추천 상품 아이디 기준으로 GROUP BY)
const findTopRecommendationsByStuff = async (stuffId) => {
  const rows = await sequelize.query(
    `
    SELECT
      MAX(p.post_id) AS postId, 
      p.recommended_stuff_id AS recommendedStuffId,
      MAX(p.recommended_image_url) AS recommendedImageUrl,
      rst.stuff_name AS recommendedStuffName,
      rb.brand_id AS recommendedBrandId,
      rb.brand_name AS recommendedBrandName,
      COUNT(sc.scrap_id) AS scrapCount
    FROM posts p
    LEFT JOIN post_scraps sc
      ON p.post_id = sc.post_id
      AND sc.deleted_at IS NULL
    INNER JOIN stuffs rst 
      ON p.recommended_stuff_id = rst.stuff_id
      AND rst.deleted_at IS NULL
    LEFT JOIN brands rb 
      ON rst.brand_id = rb.brand_id
      AND rb.deleted_at IS NULL
    WHERE p.stuff_id = :stuffId
      AND p.deleted_at IS NULL
      AND p.recommended_stuff_id IS NOT NULL
    GROUP BY 
      p.recommended_stuff_id,
      rst.stuff_id,
      rst.stuff_name,
      rb.brand_id,
      rb.brand_name
    ORDER BY scrapCount DESC
    LIMIT 4
    `,
    {
      replacements: { stuffId },
      type: QueryTypes.SELECT,
    }
  );

  return rows;
};

// 추천 조합 [더보기] 눌렀을 때 전체 순위 나열 (정확한 좋아요 연산을 위해 서브쿼리 적용)
const findAllRecommendationsByStuff = async (stuffId) => {
  const rows = await sequelize.query(
    `
    SELECT
      MAX(p.post_id) AS postId,
      p.recommended_stuff_id AS recommendedStuffId,
      MAX(p.recommended_image_url) AS recommendedImageUrl,
      rst.stuff_name AS recommendedStuffName,
      rst.price AS price,
      rb.brand_id AS recommendedBrandId,
      rb.brand_name AS recommendedBrandName,
      COUNT(DISTINCT sc.scrap_id) AS scrapCount,
      (
        SELECT COUNT(*) 
        FROM interactions sub_i 
        WHERE sub_i.stuff_id = p.recommended_stuff_id 
          AND sub_i.reaction_type = 'LIKE' 
          AND sub_i.deleted_at IS NULL
      ) AS likeCount
    FROM posts p
    LEFT JOIN post_scraps sc
      ON p.post_id = sc.post_id
      AND sc.deleted_at IS NULL
    INNER JOIN stuffs rst 
      ON p.recommended_stuff_id = rst.stuff_id
      AND rst.deleted_at IS NULL
    LEFT JOIN brands rb 
      ON rst.brand_id = rb.brand_id
      AND rb.deleted_at IS NULL
    WHERE p.stuff_id = :stuffId
      AND p.deleted_at IS NULL
      AND p.recommended_stuff_id IS NOT NULL
    GROUP BY 
      p.recommended_stuff_id,
      rst.stuff_id,
      rst.stuff_name,
      rst.price,
      rb.brand_id,
      rb.brand_name
    ORDER BY likeCount DESC, scrapCount DESC
    `,
    {
      replacements: { stuffId },
      type: QueryTypes.SELECT,
    }
  );
  return rows;
};

module.exports = {
  searchStuffs,
  findStuffDetail,
  findStuffById,
  findTopPostByStuff,
  findTopRecommendationsByStuff,
  findAllRecommendationsByStuff,
  createStuff,
};