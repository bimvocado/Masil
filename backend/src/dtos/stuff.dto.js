// 검색창 - 상품으로 검색
const toStuffSearchDTO = (stuff) => {
  return {
    stuffId: stuff.stuffId,
    stuffName: stuff.stuffName,
    price: stuff.price,
    isDiscontinued: stuff.isDiscontinued,

    imageUrl: stuff.imageUrl,

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

    recommendedStuffId: post.recommendedStuffId,
    recommendedImageUrl: post.recommendedImageUrl,
    recommendedStuffName: post.recommendedStuffName,
    recommendedBrandId: post.recommendedBrandId,
    recommendedBrandName: post.recommendedBrandName,

    createdAt: post.createdAt,
  };
};

// 상품창 - 상세 페이지 전체
const toStuffDetailDTO = ({
  stuff,
  topPost,
  recommendations = [] // 🌟 [추가] 기본값 빈 배열 설정
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

    // 상품 Interaction 집계
    totalLikeCount: Number(stuff.totalLikeCount || 0),
    koreanLikeCount: Number(stuff.koreanLikeCount || 0),
    foreignerLikeCount: Number(stuff.foreignerLikeCount || 0),

    totalDislikeCount: Number(stuff.totalDislikeCount || 0),
    koreanDislikeCount: Number(stuff.koreanDislikeCount || 0),
    foreignerDislikeCount: Number(stuff.foreignerDislikeCount || 0),

    totalPostCount: Number(stuff.totalPostCount || 0),

    // 하단 인기 게시글
    // 전체 게시글 중 스크랩이 가장 많은 글
    topPost: topPost ? toTopPostDTO(topPost) : null,

    // 🌟 [추가] 추천 조합 리스트 DTO 매핑 (최대 4개 가로 스와이프용)
    // 기존에 만들어두신 toTopPostDTO가 가진 추천 필드 매핑 로직을 그대로 활용합니다.
    recommendations: recommendations.map(post => toTopPostDTO(post)),
  };
};

module.exports = {
  toStuffSearchDTO,
  toStuffSearchResultDTO,
  toTopPostDTO,
  toStuffDetailDTO,
};