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

// 상품창 - 하단 스크랩 가장 많은 글 및 추천 아이템 바인딩 DTO
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

    // 💰 서비스 레이어에서 주입한 평균가 필드가 걸러지지 않도록 패스해 줍니다.
    averagePrice: post.averagePrice ? Number(post.averagePrice) : undefined,
    avgPrice: post.avgPrice ? Number(post.avgPrice) : undefined,

    createdAt: post.createdAt,
  };
};

// 상품창 - 상세 페이지 전체
const toStuffDetailDTO = ({
  stuff,
  topPost,
  recommendations = [] 
}) => {
  return {
    stuffId: stuff.stuffId,
    stuffName: stuff.stuffName,
    price: stuff.price,
    brandId: stuff.brandId,
    brandName: stuff.brandName,
    logoUrl: stuff.logoUrl,
    imageUrl: stuff.imageUrl,

    totalLikeCount: Number(stuff.totalLikeCount || 0),
    koreanLikeCount: Number(stuff.koreanLikeCount || 0),
    foreignerLikeCount: Number(stuff.foreignerLikeCount || 0),

    totalDislikeCount: Number(stuff.totalDislikeCount || 0),
    koreanDislikeCount: Number(stuff.koreanDislikeCount || 0),
    foreignerDislikeCount: Number(stuff.foreignerDislikeCount || 0),

    totalPostCount: Number(stuff.totalPostCount || 0),
    topPost: topPost ? toTopPostDTO(topPost) : null,
    
    // 💰 이제 내부에 정의된 toTopPostDTO가 averagePrice를 안전하게 품고 리턴합니다.
    recommendations: recommendations.map(post => toTopPostDTO(post)),
  };
};

module.exports = {
  toStuffSearchDTO,
  toStuffSearchResultDTO,
  toTopPostDTO,
  toStuffDetailDTO,
};