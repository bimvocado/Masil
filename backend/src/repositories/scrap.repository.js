const Scrap = require('../models/scrap.model');
const { QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

const findScrapsByCategory = async (categoryId) => {
  const scraps = await sequelize.query(
    `
    SELECT
      ps.scrap_id AS scrapId,
      ps.user_id AS userId,
      ps.post_id AS postId,
      ps.category_id AS categoryId,
      ps.created_at AS createdAt,
      ps.updated_at AS updatedAt,
      p.content AS content,
      p.image_url AS imageUrl,
      p.stuff_id AS stuffId,
      st.stuff_name AS stuffName,
      st.price AS price,
      b.brand_id AS brandId,
      b.brand_name AS brandName,
      COUNT(DISTINCT s2.scrap_id) AS scrapCount,
      COUNT(DISTINCT c.comment_id) AS commentCount
    FROM post_scraps ps
    INNER JOIN posts p ON ps.post_id = p.post_id AND p.deleted_at IS NULL
    LEFT JOIN stuffs st ON p.stuff_id = st.stuff_id AND st.deleted_at IS NULL
    LEFT JOIN brands b ON st.brand_id = b.brand_id AND b.deleted_at IS NULL
    LEFT JOIN post_scraps s2 ON p.post_id = s2.post_id AND s2.deleted_at IS NULL
    LEFT JOIN comments c ON p.post_id = c.post_id AND c.deleted_at IS NULL
    WHERE ps.category_id = :categoryId
      AND ps.deleted_at IS NULL
    GROUP BY
      ps.scrap_id,
      ps.user_id,
      ps.post_id,
      ps.category_id,
      ps.created_at,
      ps.updated_at,
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
      replacements: { categoryId },
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