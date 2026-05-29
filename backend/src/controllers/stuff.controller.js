const stuffService = require('../services/stuff.service');

// 검색창 - 상품으로 검색
const searchStuffs = async (req, res, next) => {
  try {
    const { keyword, category } = req.query;

    const result = await stuffService.searchStuffs({
      keyword,
      category,
    });

    return res.status(200).json({
      success: true,
      message: '상품 검색 성공',
      result,
    });
  } catch (error) {
    next(error);
  }
};

// 상품창 - 상세 페이지 전체
const getStuffDetail = async (req, res, next) => {
  try {
    const { stuffId } = req.params;

    const result = await stuffService.getStuffDetail(
      Number(stuffId)
    );

    return res.status(200).json({
      success: true,
      message: '상품 상세 조회 성공',
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchStuffs,
  getStuffDetail,
};