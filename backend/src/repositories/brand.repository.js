const { Op, QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

const Brand = require('../models/brand.model');

// 검색창 - 브랜드로 검색
const findBrands = async ({ keyword, category }) => {
  const where = {};

  if (category) {
    where.category = category;
  }

  if (keyword) {
    where.brandName = {
      [Op.like]: `%${keyword}%`,
    };
  }

  return await Brand.findAll({
    where,
    attributes: ['brandId', 'brandName', 'logoUrl', 'category'],
    order: [['brandName', 'ASC']],
  });
};

// 브랜드창 - 상단 브랜드명, 상품 개수
const findBrandInfo = async (brandId) => {
  const rows = await sequelize.query(
    `
    SELECT
      b.brand_id AS brandId,
      b.brand_name AS brandName,
      COUNT(s.stuff_id) AS totalStuffCount
    FROM brands b
    LEFT JOIN stuffs s
      ON b.brand_id = s.brand_id
      AND s.deleted_at IS NULL
    WHERE b.brand_id = :brandId
      AND b.deleted_at IS NULL
    GROUP BY b.brand_id
    `,
    {
      replacements: { brandId },
      type: QueryTypes.SELECT,
    }
  );

  return rows[0];
};

// 브랜드창 - 상품 리스트 나열
const findStuffsByBrand = async ({ brandId, sort, page, size }) => {
  const offset = page * size;

  let orderBy = 'likeCount DESC, s.created_at DESC';

  if (sort === 'DISLIKE_ASC') {
    orderBy = 'dislikeCount ASC, likeCount DESC';
  }

  if (sort === 'LATEST') {
    orderBy = 's.created_at DESC';
  }

  return await sequelize.query(
    `
    SELECT
      s.stuff_id AS stuffId,
      s.stuff_name AS stuffName,
      s.price AS price,

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
      END) AS likeCount,

      COUNT(DISTINCT CASE
        WHEN i.reaction_type = 'DISLIKE'
        THEN i.interaction_id
      END) AS dislikeCount,

      COUNT(DISTINCT p2.post_id) AS postCount

    FROM stuffs s

    LEFT JOIN interactions i
      ON s.stuff_id = i.stuff_id
      AND i.deleted_at IS NULL

    LEFT JOIN posts p2
      ON s.stuff_id = p2.stuff_id
      AND p2.deleted_at IS NULL

    WHERE s.brand_id = :brandId
      AND s.deleted_at IS NULL
      AND s.is_discontinued = false

    GROUP BY s.stuff_id

    ORDER BY ${orderBy}

    LIMIT :limit OFFSET :offset
    `,
    {
      replacements: {
        brandId,
        limit: size + 1,
        offset,
      },
      type: QueryTypes.SELECT,
    }
  );
};

module.exports = {
  findBrands,
  findBrandInfo,
  findStuffsByBrand,
};