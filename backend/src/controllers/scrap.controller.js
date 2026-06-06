const scrapService = require('../services/scrap.service');

const getScrapsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const parsedCategoryId = Number(categoryId);
    
    if (isNaN(parsedCategoryId)) {
      return res.status(400).json({ success: false, message: '유효하지 않은 카테고리 ID' });
    }
    
    const scraps = await scrapService.getScrapsByCategory(parsedCategoryId);
    return res.status(200).json({ success: true, message: '스크랩 목록 조회 성공', data: scraps });
  } catch (error) {
    next(error);
  }
};

const createScrap = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId, categoryId } = req.body;
    const scrap = await scrapService.createScrap(userId, postId, categoryId);
    return res.status(201).json({ success: true, message: '스크랩 추가 성공', data: scrap });
  } catch (error) {
    next(error);
  }
};

const deleteScrap = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    await scrapService.deleteScrap(userId, postId);
    return res.status(200).json({ success: true, message: '스크랩 취소 성공', data: null });
  } catch (error) {
    next(error);
  }
};

const getScrapStatus = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.query;
    const status = await scrapService.getScrapStatus(userId, postId);
    return res.status(200).json({ success: true, message: '스크랩 상태 조회 성공', data: { isScrapped: !!status } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getScrapsByCategory, createScrap, deleteScrap, getScrapStatus };