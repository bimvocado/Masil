const brandService = require('../services/brand.service');

// 검색창 - 브랜드 리스트 3열
const getBrandList = async (req, res, next) => {
  try {
    const { category } = req.query;

    const result = await brandService.getBrandList({
      category,
    });

    return res.status(200).json({
      success: true,
      message: '브랜드 목록 조회 성공',
      result,
    });
  } catch (error) {
    next(error);
  }
};

// 검색창 - 브랜드로 검색
const searchBrands = async (req, res, next) => {
  try {
    const { keyword, category } = req.query;

    const result = await brandService.searchBrands({
      keyword,
      category,
    });

    return res.status(200).json({
      success: true,
      message: '브랜드 검색 성공',
      result,
    });
  } catch (error) {
    next(error);
  }
};

// 브랜드창 - 상품 리스트 나열
const getBrandStuffList = async (req, res, next) => {
  try {
    const { brandId } = req.params;

    const {
      sort = 'LIKE_DESC',
      page = 0,
      size = 10,
    } = req.query;

    const allowedSorts = ['LIKE_DESC', 'DISLIKE_ASC', 'LATEST'];

    if (!allowedSorts.includes(sort)) {
      return res.status(400).json({
        success: false,
        message: 'sort는 LIKE_DESC, DISLIKE_ASC, LATEST 중 하나여야 합니다.',
      });
    }

    const result = await brandService.getBrandStuffList({
      brandId: Number(brandId),
      sort,
      page: Number(page),
      size: Number(size),
    });

    return res.status(200).json({
      success: true,
      message: '브랜드 상품 목록 조회 성공',
      result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBrandList,
  searchBrands,
  getBrandStuffList,
};