class CreatePostReqDTO {
  constructor(content, imageUrl, userId, recommendedImageUrl, brandId, stuffName, price, recommendedBrandId, recommendedStuffName, recommendedPrice) {
    this.content = content;
    this.imageUrl = imageUrl;
    this.userId = userId;
    this.recommendedImageUrl = recommendedImageUrl;
    this.brandId = brandId ? Number(brandId) : null;
    this.stuffName = stuffName;
    
    // 💸 [수정] 서비스단의 평균 가격 트랜잭션 수식 연산(AVG) 안정을 위해 확실하게 숫자로 가공합니다.
    this.price = price ? Number(price) : 0; 
    
    this.recommendedBrandId = recommendedBrandId ? Number(recommendedBrandId) : null;
    this.recommendedStuffName = recommendedStuffName;
    this.recommendedPrice = recommendedPrice ? Number(recommendedPrice) : 0;
  }
}

class UpdatePostReqDTO {
  constructor(content, imageUrl, price, recommendedStuffId) {
    this.content = content;
    this.imageUrl = imageUrl;
    
    // 💸 [수정] 수정 시에도 평균 가격 재정산 트랜잭션이 안전하게 굴러가도록 숫자화 보장합니다.
    this.price = price ? Number(price) : 0;
    this.recommendedStuffId = recommendedStuffId ? Number(recommendedStuffId) : null;
  }
}

class PostResDTO {
  constructor(post) {
    this.postId = post.postId || post.post_id;
    this.userId = post.userId || post.user_id;
    this.stuffId = post.stuffId || post.stuff_id;
    this.content = post.content;
    this.imageUrl = post.imageUrl || post.image_url;
    this.recommendedStuffId = post.recommendedStuffId || post.recommended_stuff_id;
    this.recommendedImageUrl = post.recommendedImageUrl || post.recommended_image_url;
    
    // 💸 이 개별 게시글 내부의 price 또한 숫자로 안전하게 밀어줍니다.
    this.price = post.price ? Number(post.price) : 0; 
    
    this.createdAt = post.createdAt || post.created_at;
    this.updatedAt = post.updatedAt || post.updated_at;

    this.nickname = post.nickname;
    this.profileImageUrl = post.profileImageUrl || post.profile_image_url;
    this.stuffName = post.stuffName || post.stuff_name;
    this.brandId = post.brandId || post.brand_id;
    this.brandName = post.brandName || post.brand_name;
    
    this.brandLogoUrl = post.brandLogoUrl || post.brand_logo_url;
    this.recommendedBrandLogoUrl = post.recommendedBrandLogoUrl || post.recommended_brand_logo_url;
    
    this.recommendedStuffName = post.recommendedStuffName || post.recommended_stuff_name;
    this.recommendedBrandId = post.recommendedBrandId || post.recommended_brand_id;
    this.recommendedBrandName = post.recommendedBrandName || post.recommended_brand_name;

    // 좋아요/싫어요/댓글/스크랩 정보
    this.likeCount = post.likeCount || 0;
    this.dislikeCount = post.dislikeCount || 0;
    this.commentCount = post.commentCount || 0;
    this.scrapCount = post.scrapCount || 0;
    this.isLiked = post.isLiked || false;
    this.isDisliked = post.isDisliked || false;
    this.isScrapped = post.isScrapped || false;
  }
}

module.exports = {
  CreatePostReqDTO,
  UpdatePostReqDTO,
  PostResDTO
};