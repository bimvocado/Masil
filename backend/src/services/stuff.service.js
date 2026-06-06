const stuffRepository = require('../repositories/stuff.repository');
const postRepository = require('../repositories/post.repository'); 

const {
  toStuffSearchResultDTO,
  toStuffDetailDTO,
} = require('../dtos/stuff.dto');

// 검색창 - 상품으로 검색
const searchStuffs = async ({ keyword, category }) => {
  const stuffs = await stuffRepository.searchStuffs({ keyword, category });
  const result = toStuffSearchResultDTO(stuffs);

  const stuffsWithAveragePrice = await Promise.all(
    result.stuffs.map(async (stuff) => {
      const averagePrice = await postRepository.getAveragePriceByStuffId(stuff.stuffId);
      return { ...stuff, averagePrice };
    })
  );
  return { ...result, stuffs: stuffsWithAveragePrice };
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

// 상품창 - 상세 페이지 전체 (메인 상품 평균가 + 추천 스와이프 상품 평균가 추가)
const getStuffDetail = async (stuffId) => {
  const stuff = await stuffRepository.findStuffDetail(stuffId);

  if (!stuff) {
    const error = new Error('존재하지 않는 상품입니다.');
    error.status = 404;
    throw error;
  }

  const topPost = await stuffRepository.findTopPostByStuff(stuffId);
  const recommendations = await stuffRepository.findTopRecommendationsByStuff(stuffId);

  // 💰 메인 상품 실시간 평균가 정산
  const averagePrice = await postRepository.getAveragePriceByStuffId(stuffId);

  // 💰 가로 스와이프 추천 상품들 각각의 실시간 평균가 정산
  const recommendationsWithAvgPrice = await Promise.all(
    (recommendations || []).map(async (rec) => {
      const targetStuffId = rec.recommendedStuffId; 
      const recAvgPrice = await postRepository.getAveragePriceByStuffId(targetStuffId);
      return {
        ...rec,
        averagePrice: recAvgPrice,
        avgPrice: recAvgPrice 
      };
    })
  );

  const detailDTO = toStuffDetailDTO({
    stuff,
    topPost,
    recommendations: recommendationsWithAvgPrice, 
  });

  return {
    ...detailDTO,
    averagePrice, 
    avgPrice: averagePrice
  };
};

// 상품 상세 페이지 - 추천 조합 더보기 서비스 로직 (각 아이템 평균가 추가)
const getProductRecommendations = async (stuffId) => {
  const recommendations = await stuffRepository.findAllRecommendationsByStuff(stuffId);
  
  const processedStuffs = await Promise.all(
    recommendations.map(async (item) => {
      const targetStuffId = item.recommendedStuffId;
      const calculatedAvgPrice = await postRepository.getAveragePriceByStuffId(targetStuffId);

      return {
        recommendedStuffId: item.recommendedStuffId,
        recommendedStuffName: item.recommendedStuffName,
        recommendedBrandName: item.recommendedBrandName,
        price: Number(item.price || 0),
        averagePrice: calculatedAvgPrice, 
        avgPrice: calculatedAvgPrice,
        likeCount: Number(item.likeCount || 0),   
        scrapCount: Number(item.scrapCount || 0), 
        recommendedImageUrl: item.recommendedImageUrl
      };
    })
  );

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