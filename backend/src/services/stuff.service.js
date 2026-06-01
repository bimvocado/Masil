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

// 상품창 - 상세 페이지 전체
const getStuffDetail = async (stuffId) => {
  const stuff = await stuffRepository.findStuffDetail(stuffId);

  if (!stuff) {
    const error = new Error('존재하지 않는 상품입니다.');
    error.status = 404;
    throw error;
  }

  const topPost = await stuffRepository.findTopPostByStuff(stuffId);

  console.log('topPost 확인:', topPost);

  return toStuffDetailDTO({
    stuff,
    topPost,
  });
};

module.exports = {
  searchStuffs,
  createStuff,
  getStuffDetail,
};