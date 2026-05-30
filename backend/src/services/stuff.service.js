const stuffRepository = require('../repositories/stuff.repository');

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

  return toStuffSearchResultDTO(stuffs);
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

  return toStuffDetailDTO({
    stuff,
    topPost,
  });
};

module.exports = {
  searchStuffs,
  getStuffDetail,
};