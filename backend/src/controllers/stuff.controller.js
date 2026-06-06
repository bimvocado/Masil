const stuffService = require('../services/stuff.service');
const ApiResponse = require('../utils/api.response.util');

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

// 상품 생성 (초기 생성)
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
      price: price ? Number(price) : 0, // 첫 빌드 단가 또는 0원 초기화
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

// 상품창 - 상세 페이지 전체 (stuffs 테이블의 price = 평균 가격 매핑 보장)
const getStuffDetail = async (req, res, next) => {
  try {
    const { stuffId } = req.params;

    const result = await stuffService.getStuffDetail(Number(stuffId));
    
    // 💰 stuffs 테이블의 정산된 price를 프론트 규격인 averagePrice 필드로 확실하게 치환 및 매핑
    const responseData = {
      ...result,
      averagePrice: result.price ?? 0, // 테이블의 price가 곧 실시간 트랜잭션 평균가!
      isKorean: req.user ? req.user.is_korean : true,
    };

    return res.status(200).json({
      success: true,
      message: '상품 상세 조회 성공',
      result: responseData,
    });
  } catch (error) {
    next(error);
  }
};

// 상품 상세 페이지 - 추천 조합 더보기 전체 목록 조회
const getProductRecommendations = async (req, res, next) => {
  try {
    const { stuffId } = req.params; 

    const result = await stuffService.getProductRecommendations(stuffId);

    // 💰 추천 리스트 데이터 내부의 상품들도 가공된 평균가 규격을 가지고 있는지 검증/가공
    const processedResult = Array.isArray(result) 
      ? result.map(item => ({
          ...item,
          averagePrice: item.price ?? item.averagePrice ?? 0
        }))
      : result;

    // 공통 규격 ApiResponse.send를 이용해 데이터 전송
    return ApiResponse.send(res, processedResult, "추천 조합 리스트 조회 성공", 200);

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