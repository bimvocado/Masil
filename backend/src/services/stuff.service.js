const stuffRepository = require('../repositories/stuff.repository');
const postRepository = require('../repositories/post.repository');

const {
  toStuffSearchResultDTO,
  toStuffDetailDTO,
} = require('../dtos/stuff.dto');

// 검색창 - 상품으로 검색
const searchStuffs = async ({ keyword, category }) => {
  const stuffs = await stuffRepository.searchStuffs({
    keyword,
    category,
  });

  // return toStuffSearchResultDTO(stuffs);

  const result = toStuffSearchResultDTO(stuffs);

  const stuffsWithAveragePrice = await Promise.all(
    result.stuffs.map(async (stuff) => {
      const averagePrice = await postRepository.getAveragePriceByStuffId(
        stuff.stuffId
      );
      return {
        ...stuff,
        averagePrice,
      };
    })
  );
  return {
    ...result,
    stuffs: stuffsWithAveragePrice,
  };
};

// 상품 생성
const createStuff = async ({ brandId, stuffName, price }) => {
  const stuff = await stuffRepository.createStuff({
    brandId,
    stuffName,
    price,
  });

  return {
    stuffId: stuff.stuffId,
    stuffName: stuff.stuffName,
    price: stuff.price,
    brandId: stuff.brandId,
  };
};

// // 상품창 - 상세 페이지 전체
// const getStuffDetail = async (stuffId) => {
//   const stuff = await stuffRepository.findStuffDetail(stuffId);

//   if (!stuff) {
//     const error = new Error('존재하지 않는 상품입니다.');
//     error.status = 404;
//     throw error;
//   }

//   const topPost = await stuffRepository.findTopPostByStuff(stuffId);

//   console.log('topPost 확인:', topPost);

//   return toStuffDetailDTO({
//     stuff,
//     topPost,
//   });
// };


// 추가(추천조합 스와이프) : 상품창 - 상세 페이지 전체
const getStuffDetail = async (stuffId) => {
  const stuff = await stuffRepository.findStuffDetail(stuffId);

  if (!stuff) {
    const error = new Error('존재하지 않는 상품입니다.');
    error.status = 404;
    throw error;
  }

  const topPost = await stuffRepository.findTopPostByStuff(stuffId);
  
  // 🌟 [추가] 상위 추천 조합 리스트 4개 들고오기
  const recommendations = await stuffRepository.findTopRecommendationsByStuff(stuffId);

  console.log('topPost 확인:', topPost);
  console.log('recommendations 확인:', recommendations); // 로그로 개수와 데이터 확인용

  // 🌟 DTO 인자에 recommendations를 추가로 전달합니다.
  return toStuffDetailDTO({
    stuff,
    topPost,
    recommendations, 
  });
};


// [추가] 상품 상세 페이지 - 추천 조합 더보기 서비스 로직
const getProductRecommendations = async (stuffId) => {
  // 1. 레포지토리를 호출하여 DB에서 순수 데이터를 가져옴
  const recommendations = await stuffRepository.findAllRecommendationsByStuff(stuffId);
  
  // 2. 다른 서비스들처럼 데이터를 오브젝트 형태로 정돈 및 스펙 가공하여 리턴
  return {
    totalCount: recommendations.length,
    stuffs: recommendations.map(item => ({
      recommendedStuffId: item.recommendedStuffId,
      recommendedStuffName: item.recommendedStuffName,
      recommendedBrandName: item.recommendedBrandName,
      price: Number(item.price || 0),
      likeCount: Number(item.likeCount || 0),   // 따봉 수
      scrapCount: Number(item.scrapCount || 0), // 스크랩 수
      recommendedImageUrl: item.recommendedImageUrl
    }))
  };
};

module.exports = {
  searchStuffs,
  createStuff,
  getStuffDetail,
  getProductRecommendations
};