const Scrap = require('../models/scrap.model');

const findScrapsByCategory = async (categoryId) => {
  return await Scrap.findAll({ where: { categoryId } });
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