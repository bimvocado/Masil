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
      s.price AS price, -- 💰 이미 최신화된 평균값 스냅샷 신뢰
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
      s.price AS price, -- 💰 상단에 박힐 가공 완료된 평균 단가

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

// 💡 [참고] 상품 신규 생성 시 (options 추가하여 트랜잭션 안전성 상향)
const createStuff = async ({ brandId, stuffName, price }, options = {}) => {
  return await Stuff.create({
    brandId,
    stuffName,
    price,
  }, options);
};

// 상품창 - 하단 스크랩 가장 많은 글 (⚠️ 누락되었던 추천 상품의 캐싱 price 컬럼 복구 추가!)
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
      
      -- 💰 [누락 복구] 하단 카드 렌더링에 필수적인 추천 상품 평균 단가 연동
      rst.price AS price, 

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
      rst.price,
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

// 상품 상세 페이지 - 가로 스와이프용 상위 추천 조합 최대 4개 조회 (⚠️ 누락되었던 추천 상품의 캐싱 price 컬럼 복구 추가!)
const findTopRecommendationsByStuff = async (stuffId) => {
  const rows = await sequelize.query(
    `
    SELECT
      MAX(p.post_id) AS postId, 
      p.recommended_stuff_id AS recommendedStuffId,
      MAX(p.recommended_image_url) AS recommendedImageUrl,
      rst.stuff_name AS recommendedStuffName,
      
      -- 💰 [누락 복구] 프론트 가로 FlatList 카드에 출력될 추천 상품의 평균 단가 연동
      rst.price AS price, 

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
      rst.price,
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

// 추천 조합 [더보기] 눌렀을 때 전체 순위 나열
const findAllRecommendationsByStuff = async (stuffId) => {
  const rows = await sequelize.query(
    `
    SELECT
      MAX(p.post_id) AS postId,
      p.recommended_stuff_id AS recommendedStuffId,
      MAX(p.recommended_image_url) AS recommendedImageUrl,
      rst.stuff_name AS recommendedStuffName,
      
      -- 💰 [통일화] 캐싱된 최신 단가 출력 보장
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

// 💡 [서비스 트랜잭션 동기화용 핵심 함수]
// 포스트 변경 시 stuffs 테이블의 price 컬럼 자체를 강제로 평균 업데이트하는 실행문
const updateStuffAveragePrice = async (stuffId, averagePrice, options = {}) => {
  return await Stuff.update(
    { price: averagePrice },
    { 
      where: { stuffId },
      ...options // 트랜잭션 동기화 전파
    }
  );
};

module.exports = {
  searchStuffs,
  findStuffDetail,
  findStuffById,
  findTopPostByStuff,
  findTopRecommendationsByStuff,
  findAllRecommendationsByStuff,
  createStuff,
  updateStuffAveragePrice // 추가 등록 보장
};