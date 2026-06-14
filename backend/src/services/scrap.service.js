const scrapRepository = require('../repositories/scrap.repository');

const getScrapsByCategory = async (categoryId, viewerId = null) => {
  return await scrapRepository.findScrapsByCategory(categoryId, viewerId);
};

const createScrap = async (userId, postId, categoryId) => {
  return await scrapRepository.createScrap(userId, postId, categoryId);
};

const deleteScrap = async (userId, postId) => {
  return await scrapRepository.deleteScrap(userId, postId);
};

const getScrapStatus = async (userId, postId) => {
  return await scrapRepository.findScrapStatus(userId, postId);
};

module.exports = { getScrapsByCategory, createScrap, deleteScrap, getScrapStatus };