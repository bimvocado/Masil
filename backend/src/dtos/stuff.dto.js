// 검색창 - 상품으로 검색
const toStuffSearchDTO = (stuff) => {
  return {
    stuffId: stuff.stuffId,
    stuffName: stuff.stuffName,
    price: stuff.price,
    isDiscontinued: stuff.isDiscontinued,

    brandId: stuff.Brand?.brandId,
    brandName: stuff.Brand?.brandName,
    logoUrl: stuff.Brand?.logoUrl,
    category: stuff.Brand?.category,
  };
};

// 검색창 - 상품 검색 결과
const toStuffSearchResultDTO = (stuffs) => {
  return {
    stuffListSize: stuffs.length,
    stuffs: stuffs.map(toStuffSearchDTO),
  };
};

// 상품창 - 하단 스크랩 가장 많은 글
const toTopPostDTO = (post) => {
  return {
    postId: post.postId,
    content: post.content,
    imageUrl: post.imageUrl,
    userId: post.userId,
    nickname: post.nickname,

    scrapCount: Number(post.scrapCount || 0),

    createdAt: post.createdAt,
  };
};

// 상품창 - 상세 페이지 전체
// 추천조합 탭은 아직 구현X
const toStuffDetailDTO = ({
  stuff,
  topPost,
}) => {
  return {
    stuffId: stuff.stuffId,
    stuffName: stuff.stuffName,
    price: stuff.price,

    brandId: stuff.brandId,
    brandName: stuff.brandName,
    logoUrl: stuff.logoUrl,

    // 상단 대표 이미지
    // 이미지 있는 게시글 중 스크랩이 가장 많은 글의 사진
    imageUrl: stuff.imageUrl,

    // 상품 상세 정보
    totalLikeCount: Number(stuff.totalLikeCount || 0),
    koreanLikeCount: Number(stuff.koreanLikeCount || 0),
    foreignerLikeCount: Number(stuff.foreignerLikeCount || 0),

    totalPostCount: Number(stuff.totalPostCount || 0),

    // 하단 인기 게시글
    // 전체 게시글 중 스크랩이 가장 많은 글
    topPost: topPost ? toTopPostDTO(topPost) : null,
  };
};

module.exports = {
  toStuffSearchDTO,
  toStuffSearchResultDTO,
  toTopPostDTO,
  toStuffDetailDTO,
};