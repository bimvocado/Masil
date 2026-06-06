const stuffRepository = require('../repositories/stuff.repository');
const {
  toStuffSearchResultDTO,
  toStuffDetailDTO
} = require('../dtos/stuff.dto');

// 검색창 - 상품으로 검색 (평균가 서브쿼리 루프 완벽 제거 상태 유지)
const searchStuffs = async ({ keyword, category }) => {
  const stuffs = await stuffRepository.searchStuffs({ keyword, category });
  return toStuffSearchResultDTO(stuffs);
};

// 상품 생성
const createStuff = async ({ brandId, stuffName, price }) => {
  const stuff = await stuffRepository.createStuff({ brandId, stuffName, price });
  return {
    stuffId: stuff.stuffId,
    stuffName: stuff.stuffName,
    price: stuff.price,
    brandId: stuff.brandId,
  };
};

// 상품창 - 상세 페이지 전체 (이미 튜닝된 단일 레포지토리의 join 데이터 주입)
const getStuffDetail = async (stuffId) => {
  const stuff = await stuffRepository.findStuffDetail(stuffId);

  if (!stuff) {
    const error = new Error('존재하지 않는 상품입니다.');
    error.status = 404;
    throw error;
  }

  const topPost = await stuffRepository.findTopPostByStuff(stuffId);
  const recommendations = await stuffRepository.findTopRecommendationsByStuff(stuffId);

  return toStuffDetailDTO({
    stuff,
    topPost,
    recommendations: recommendations || []
  });
};

// 상품 상세 페이지 - 추천 조합 더보기 서비스 로직
const getProductRecommendations = async (stuffId) => {
  const recommendations = await stuffRepository.findAllRecommendationsByStuff(stuffId);
  
  const processedStuffs = recommendations.map((item) => {
    return {
      recommendedStuffId: item.recommendedStuffId,
      recommendedStuffName: item.recommendedStuffName,
      recommendedBrandName: item.recommendedBrandName,
      price: Number(item.price || 0), // 💰 캐싱 연동 완료된 rst.price 필드 수신
      likeCount: Number(item.likeCount || 0),   
      scrapCount: Number(item.scrapCount || 0), 
      recommendedImageUrl: item.recommendedImageUrl
    };
  });

  return {
    totalCount: processedStuffs.length,
    stuffs: processedStuffs
  };
};

module.exports = {
  searchStuffs,
  createStuff,
  getStuffDetail,
  getProductRecommendations
};