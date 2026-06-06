const stuffService = require('../services/stuff.service');
const stuffRepository = require('../repositories/stuff.repository');
const ApiResponse = require('../utils/api-response');

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

// 상품 생성
const createStuff = async (req, res, next) => {
  try {
    const { brandId, stuffName, price } = req.body;

    if (!brandId || !stuffName) {
      return res.status(400).json({
        success: false,
        message: 'brandId와 stuffName은 필수입니다.',
      });
    }

    const result = await stuffService.createStuff({
      brandId: Number(brandId),
      stuffName,
      price: price ? Number(price) : 0,
    });

    return res.status(201).json({
      success: true,
      message: '상품 생성 성공',
      result,
    });
  } catch (error) {
    next(error);
  }
};

// 상품창 - 상세 페이지 전체 - user 정보까지 전달 드가야지
const getStuffDetail = async (req, res, next) => {
  try {
    const { stuffId } = req.params;

    const result = await stuffService.getStuffDetail(
      Number(stuffId)
    );
    
    return res.status(200).json({
      success: true,
      message: '상품 상세 조회 성공',
      result: {
        ...result,
        isKorean: req.user
          ? req.user.is_korean
          : true,
      },
    });
  } catch (error) {
    next(error);
  }
};

//  상품 상세 페이지 - 추천 조합 더보기 전체 목록 조회
const getProductRecommendations = async (req, res, next) => {
  try {
    const { stuffId } = req.params; 

    // 🌟 레포지토리 직접 호출 대신, 구조에 맞게 서비스(stuffService)를 호출합니다!
    const result = await stuffService.getProductRecommendations(stuffId);

    // 🌟 이 함수만 공통 규격인 ApiResponse.send()를 사용하여 응답을 반환합니다.
    // 규격: send(res, data, message, status)
    return ApiResponse.send(res, result, "추천 조합 리스트 조회 성공", 200);

  } catch (error) {
    console.error('추천 조합 더보기 조회 중 에러 발생:', error);
    next(error); 
  }
};

module.exports = {
  searchStuffs,
  createStuff,
  getStuffDetail,
  getProductRecommendations
};