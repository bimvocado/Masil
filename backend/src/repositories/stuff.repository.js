const { Op, QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

const Stuff = require('../models/stuff.model');
const Brand = require('../models/brand.model');

// 검색창 - 상품으로 검색
// 검색창 - 상품으로 검색
const searchStuffs = async ({ keyword, category }) => {
  const where = {};
  const brandWhere = {};

  if (keyword) {
    where.stuffName = {
      [Op.like]: `%${keyword}%`,
    };
  }

  if (category) {
    brandWhere.category = category;
  }

  return await Stuff.findAll({
    where,
    include: [
      {
        model: Brand,
        where: brandWhere,
        required: true,
      },
    ],
    order: [['stuffName', 'ASC']],
  });
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
        LEFT JOIN scraps sc
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

      COUNT(sc.scrap_id) AS scrapCount

    FROM posts p

    LEFT JOIN scraps sc
      ON p.post_id = sc.post_id
      AND sc.deleted_at IS NULL

    LEFT JOIN users u
      ON p.user_id = u.user_id

    WHERE p.stuff_id = :stuffId
      AND p.deleted_at IS NULL

    GROUP BY 
      p.post_id, 
      p.content, 
      p.image_url, 
      p.user_id, 
      u.nickname, 
      p.created_at

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

module.exports = {
  searchStuffs,
  findStuffDetail,
  findTopPostByStuff,
};