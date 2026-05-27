const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

const Stuff = require('../models/stuff.model');
const Brand = require('../models/brand.model');

// sequelize 연산자 (LIKE, OR, AND, >=, <=)
const { Op } = require('sequelize');

// 상품 생성
const createStuff = async (stuffData) => {
  return await Stuff.create(stuffData);
};

// 상품 ID로 조회
const findStuffById = async (stuffId) => {
  return await Stuff.findByPk(stuffId);
};

// 브랜드 ID로 조회
const findBrandById = async (brandId) => {
  return await Brand.findByPk(brandId);
};

// 상품 수정
const updateStuff = async (stuff, updateData) => {
  return await stuff.update(updateData);
};

// 상품 삭제
const deleteStuff = async (stuff) => {
  return await stuff.destroy();
};

// 브랜드별 상품 목록 조회
// 옳소/싫소는 posts -> interactions(post_id)로 합산
const findStuffsByBrandId = async (brandId, sort, page, size) => {
  let orderSql = 's.created_at DESC';

  if (sort === 'LIKE_DESC') {
    orderSql = 'likeCount DESC, s.created_at DESC';
  }

  if (sort === 'DISLIKE_ASC') {
    orderSql = 'dislikeCount ASC, s.created_at DESC';
  }

  if (sort === 'LATEST') {
    orderSql = 's.created_at DESC';
  }

  const offset = Number(page) * Number(size);

  return await sequelize.query(
    `
    SELECT
      s.stuff_id AS stuffId,
      s.brand_id AS brandId,
      s.stuff_name AS stuffName,
      s.price AS price,
      s.created_at AS createdAt,

      COUNT(CASE WHEN i.reaction_type = 'LIKE' THEN 1 END) AS likeCount,
      COUNT(CASE WHEN i.reaction_type = 'DISLIKE' THEN 1 END) AS dislikeCount

    FROM stuffs s

    LEFT JOIN posts p
      ON s.stuff_id = p.stuff_id
      AND p.deleted_at IS NULL

    LEFT JOIN interactions i
      ON p.post_id = i.post_id
      AND i.deleted_at IS NULL

    WHERE s.brand_id = :brandId
      AND s.deleted_at IS NULL
      AND s.is_discontinued IS NOT TRUE

    GROUP BY
      s.stuff_id,
      s.brand_id,
      s.stuff_name,
      s.price,
      s.created_at

    ORDER BY ${orderSql}

    LIMIT :size OFFSET :offset
    `,
    {
      replacements: {
        brandId,
        size: Number(size),
        offset,
      },
      type: QueryTypes.SELECT,
    }
  );
};

// 브랜드별 상품 총 개수
const countStuffsByBrandId = async (brandId) => {
  return await Stuff.count({
    where: {
      brandId,
      [Op.or]: [
        { isDiscontinued: false },
        { isDiscontinued: null },
      ],
    },
  });
};

// 상품 상세 정보
// 상품에 연결된 게시글들의 옳소/싫소를 합산
const findStuffDetailById = async (stuffId) => {
  const result = await sequelize.query(
    `
    SELECT
      s.stuff_id AS stuffId,
      s.stuff_name AS stuffName,
      s.price AS price,

      b.brand_id AS brandId,
      b.brand_name AS brandName,

      COUNT(CASE WHEN i.reaction_type = 'LIKE' THEN 1 END) AS likeCount,
      COUNT(CASE WHEN i.reaction_type = 'DISLIKE' THEN 1 END) AS dislikeCount,

      COUNT(CASE WHEN i.reaction_type = 'LIKE' AND u.is_korean = true THEN 1 END) AS koreanLikeCount,
      COUNT(CASE WHEN i.reaction_type = 'LIKE' AND u.is_korean = false THEN 1 END) AS foreignLikeCount

    FROM stuffs s

    JOIN brands b
      ON s.brand_id = b.brand_id

    LEFT JOIN posts p
      ON s.stuff_id = p.stuff_id
      AND p.deleted_at IS NULL

    LEFT JOIN interactions i
      ON p.post_id = i.post_id
      AND i.deleted_at IS NULL

    LEFT JOIN users u
      ON i.user_id = u.user_id
      AND u.deleted_at IS NULL

    WHERE s.stuff_id = :stuffId
      AND s.deleted_at IS NULL

    GROUP BY
      s.stuff_id,
      s.stuff_name,
      s.price,
      b.brand_id,
      b.brand_name
    `,
    {
      replacements: { stuffId },
      type: QueryTypes.SELECT,
    }
  );

  return result[0] || null;
};

// 옳소가 가장 많은 사진 리뷰
const findBestReviewImageByStuffId = async (stuffId) => {
  const result = await sequelize.query(
    `
    SELECT
      p.image_url AS imageUrl,
      COUNT(CASE WHEN i.reaction_type = 'LIKE' THEN 1 END) AS likeCount

    FROM posts p

    LEFT JOIN interactions i
      ON p.post_id = i.post_id
      AND i.deleted_at IS NULL

    WHERE p.stuff_id = :stuffId
      AND p.deleted_at IS NULL
      AND p.image_url IS NOT NULL

    GROUP BY
      p.post_id,
      p.image_url,
      p.created_at

    ORDER BY
      likeCount DESC,
      p.created_at DESC

    LIMIT 1
    `,
    {
      replacements: { stuffId },
      type: QueryTypes.SELECT,
    }
  );

  return result[0] || null;
};

// 추천 조합 상위 2개
const findRecommendedStuffs = async (stuffId) => {
  return await sequelize.query(
    `
    SELECT
      tagged.stuff_id AS stuffId,
      tagged.stuff_name AS stuffName,
      tagged.price AS price,

      COUNT(CASE WHEN i.reaction_type = 'LIKE' THEN 1 END) AS likeCount,
      COUNT(CASE WHEN i.reaction_type = 'DISLIKE' THEN 1 END) AS dislikeCount

    FROM posts p

    JOIN post_tags pt
      ON p.post_id = pt.post_id

    JOIN stuffs tagged
      ON pt.connected_stuff_id = tagged.stuff_id

    LEFT JOIN posts tagged_posts
      ON tagged.stuff_id = tagged_posts.stuff_id
      AND tagged_posts.deleted_at IS NULL

    LEFT JOIN interactions i
      ON tagged_posts.post_id = i.post_id
      AND i.deleted_at IS NULL

    WHERE p.stuff_id = :stuffId
      AND p.deleted_at IS NULL
      AND tagged.deleted_at IS NULL

    GROUP BY
      tagged.stuff_id,
      tagged.stuff_name,
      tagged.price

    ORDER BY
      likeCount DESC,
      dislikeCount ASC

    LIMIT 2
    `,
    {
      replacements: { stuffId },
      type: QueryTypes.SELECT,
    }
  );
};

// 옳소가 가장 많은 리뷰
const findBestReviewByStuffId = async (stuffId) => {
  const result = await sequelize.query(
    `
    SELECT
      p.post_id AS postId,
      p.content AS content,
      p.image_url AS imageUrl,
      p.created_at AS createdAt,

      u.user_id AS userId,
      u.nickname AS nickname,
      u.profile_image_url AS profileImageUrl,

      COUNT(CASE WHEN i.reaction_type = 'LIKE' THEN 1 END) AS likeCount,
      COUNT(CASE WHEN i.reaction_type = 'DISLIKE' THEN 1 END) AS dislikeCount

    FROM posts p

    JOIN users u
      ON p.user_id = u.user_id

    LEFT JOIN interactions i
      ON p.post_id = i.post_id
      AND i.deleted_at IS NULL

    WHERE p.stuff_id = :stuffId
      AND p.deleted_at IS NULL

    GROUP BY
      p.post_id,
      p.content,
      p.image_url,
      p.created_at,
      u.user_id,
      u.nickname,
      u.profile_image_url

    ORDER BY
      likeCount DESC,
      p.created_at DESC

    LIMIT 1
    `,
    {
      replacements: { stuffId },
      type: QueryTypes.SELECT,
    }
  );

  return result[0] || null;
};

// 자동완성 : 상품 검색
const searchStuffsByName = async (keyword) => {
  return await Stuff.findAll({
    where: {
      stuffName: {
        [Op.like]: `%${keyword}%`,
      },
      isDiscontinued:false,
    },
    limit: 10,
    order: [['createdAt', 'DESC']]
  });
};

// 자동완성 : 상품명으로 찾으며, 없으면 생성
const findOrCreateStuffByName = async (stuffName) => {
  const [stuff, created] = await Stuff.findOrCreate({
    where: { stuffName },
    defaults: {
      stuffName,
      brandId: 9999,
      price: 0,
      isDiscontinued: false,
    },
  });

  return { stuff, created };
}

module.exports = {
  createStuff,
  findStuffById,
  findBrandById,
  updateStuff,
  deleteStuff,
  findStuffsByBrandId,
  countStuffsByBrandId,
  findStuffDetailById,
  findBestReviewImageByStuffId,
  findRecommendedStuffs,
  findBestReviewByStuffId,
  searchStuffsByName,
  findOrCreateStuffByName,
};