// 검색창 - 상품으로 검색 (stuffs 테이블의 price 자체가 이미 완벽한 실시간 평균가임)
const toStuffSearchDTO = (stuff) => {
  return {
    stuffId: stuff.stuffId || stuff.stuff_id,
    stuffName: stuff.stuffName || stuff.stuff_name,
    
    // 💰 [확정] 테이블 내 최신 트랜잭션 평균 가격만 깨끗하게 숫자로 매핑해 전달
    price: stuff.price ? Number(stuff.price) : 0, 
    
    isDiscontinued: stuff.isDiscontinued || stuff.is_discontinued,
    imageUrl: stuff.imageUrl || stuff.image_url,
    brandId: stuff.Brand?.brandId || stuff.Brand?.brand_id,
    brandName: stuff.Brand?.brandName || stuff.Brand?.brand_name,
    logoUrl: stuff.Brand?.logoUrl || stuff.Brand?.logo_url,
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
    postId: post.postId || post.post_id,
    content: post.content,
    imageUrl: post.imageUrl || post.image_url,
    userId: post.userId || post.user_id,
    nickname: post.nickname,
    scrapCount: Number(post.scrapCount || post.scrap_count || 0),
    recommendedStuffId: post.recommendedStuffId || post.recommended_stuff_id,
    recommendedImageUrl: post.recommendedImageUrl || post.recommended_image_url,
    recommendedStuffName: post.recommendedStuffName || post.recommended_stuff_name,
    recommendedBrandId: post.recommendedBrandId || post.recommended_brand_id,
    recommendedBrandName: post.recommendedBrandName || post.recommended_brand_name,

    // 💸 가짜 필드 찌꺼기 싹 밀고, 오직 순정 price 필드 하나로 완전히 단일화
    price: post.price ? Number(post.price) : 0,

    createdAt: post.createdAt || post.created_at,
  };
};

// 상품창 - 상세 페이지 전체
const toStuffDetailDTO = ({
  stuff,
  topPost,
  recommendations = [] 
}) => {
  return {
    stuffId: stuff.stuffId || stuff.stuff_id,
    stuffName: stuff.stuffName || stuff.stuff_name,
    
    // 💰 [확정] 상품 상세 화면 최상단에 뿌릴 실시간 평균가 스냅샷
    price: stuff.price ? Number(stuff.price) : 0, 
    
    brandId: stuff.brandId || stuff.brand_id,
    brandName: stuff.brandName || stuff.brand_name,
    logoUrl: stuff.logoUrl || stuff.logo_url,
    imageUrl: stuff.imageUrl || stuff.image_url,

    totalLikeCount: Number(stuff.totalLikeCount || stuff.total_like_count || 0),
    koreanLikeCount: Number(stuff.koreanLikeCount || stuff.korean_like_count || 0),
    foreignerLikeCount: Number(stuff.foreignerLikeCount || stuff.foreigner_like_count || 0),

    totalDislikeCount: Number(stuff.totalDislikeCount || stuff.total_dislike_count || 0),
    koreanDislikeCount: Number(stuff.koreanDislikeCount || stuff.korean_dislike_count || 0),
    foreignerDislikeCount: Number(stuff.foreignerDislikeCount || stuff.foreigner_dislike_count || 0),

    totalPostCount: Number(stuff.totalPostCount || stuff.total_post_count || 0),
    topPost: topPost ? toTopPostDTO(topPost) : null,
    
    // 💸 내부의 가공 완료된 toTopPostDTO가 순정 price 데이터만 예쁘게 물고 나갑니다.
    recommendations: recommendations.map(post => toTopPostDTO(post)),
  };
};

module.exports = {
  toStuffSearchDTO,
  toStuffSearchResultDTO,
  toTopPostDTO,
  toStuffDetailDTO,
};