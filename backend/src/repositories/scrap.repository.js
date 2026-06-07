const Scrap = require('../models/scrap.model');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

const findScrapsByCategory = async (categoryId, viewerId = null) => {
  const scraps = await sequelize.query(
    `
    SELECT
      ps.scrap_id AS scrapId,
      ps.user_id AS userId,
      ps.post_id AS postId,
      ps.category_id AS categoryId,
      ps.created_at AS createdAt,
      ps.created_at AS scrapCreatedAt,
      ps.updated_at AS updatedAt,
      p.created_at AS postCreatedAt,
      p.content AS content,
      p.image_url AS imageUrl,
      p.stuff_id AS stuffId,
      st.stuff_name AS stuffName,
      st.price AS price,
      b.brand_id AS brandId,
      b.brand_name AS brandName,
      COUNT(DISTINCT s2.scrap_id) AS scrapCount,
      COUNT(DISTINCT c.comment_id) AS commentCount,
      MAX(CASE WHEN i.user_id = :viewerId AND i.reaction_type = 'LIKE' THEN 1 ELSE 0 END) = 1 AS isLiked,
      MAX(CASE WHEN i.user_id = :viewerId AND i.reaction_type = 'DISLIKE' THEN 1 ELSE 0 END) = 1 AS isDisliked,
      COUNT(DISTINCT CASE WHEN i.reaction_type = 'LIKE' THEN i.interaction_id END) AS likeCount,
      COUNT(DISTINCT CASE WHEN i.reaction_type = 'DISLIKE' THEN i.interaction_id END) AS dislikeCount
    FROM post_scraps ps
    INNER JOIN posts p ON ps.post_id = p.post_id AND p.deleted_at IS NULL
    LEFT JOIN stuffs st ON p.stuff_id = st.stuff_id AND st.deleted_at IS NULL
    LEFT JOIN brands b ON st.brand_id = b.brand_id AND b.deleted_at IS NULL
    LEFT JOIN post_scraps s2 ON p.post_id = s2.post_id AND s2.deleted_at IS NULL
    LEFT JOIN comments c ON p.post_id = c.post_id AND c.deleted_at IS NULL
    LEFT JOIN interactions i ON p.stuff_id = i.stuff_id AND i.deleted_at IS NULL
    WHERE ps.category_id = :categoryId
      AND ps.deleted_at IS NULL
    GROUP BY
      ps.scrap_id,
      ps.user_id,
      ps.post_id,
      ps.category_id,
      ps.created_at,
      ps.updated_at,
      p.created_at,
      p.content,
      p.image_url,
      p.stuff_id,
      st.stuff_name,
      st.price,
      b.brand_id,
      b.brand_name
    ORDER BY ps.created_at DESC
    `,
    {
      replacements: { categoryId, viewerId: viewerId || 0 },
      type: QueryTypes.SELECT,
    }
  );

  return scraps;
};

const createScrap = async (userId, postId, categoryId) => {
  return await Scrap.create({ userId, postId, categoryId });
};

const deleteScrap = async (userId, postId) => {
  const scrap = await Scrap.findOne({ where: { userId, postId } });
  if (!scrap) return null;
  return await scrap.destroy();
};

const findScrapStatus = async (userId, postId) => {
  return await Scrap.findOne({ where: { userId, postId } });
};

module.exports = { findScrapsByCategory, createScrap, deleteScrap, findScrapStatus };