class CreatePostReqDTO {
  constructor(content, imageUrl, userId, recommendedImageUrl, brandId, stuffName, price, recommendedBrandId, recommendedStuffName, recommendedPrice) {
    this.content = content;
    this.imageUrl = imageUrl;
    this.userId = userId;
    this.recommendedImageUrl = recommendedImageUrl;
    this.brandId = brandId;
    this.stuffName = stuffName;
    this.price = price;
    this.recommendedBrandId = recommendedBrandId;
    this.recommendedStuffName = recommendedStuffName;
    this.recommendedPrice = recommendedPrice;
  }
}

class UpdatePostReqDTO {
  constructor(content, imageUrl, price, recommendedStuffId) {
    this.content = content;
    this.imageUrl = imageUrl;
    this.price = price;
    this.recommendedStuffId = recommendedStuffId;
  }
}

// 🌟 [수정 완료] 브랜드 로고와 메타 정보 매핑 추가
class PostResDTO {
  constructor(post) {
    this.postId = post.postId || post.post_id;
    this.userId = post.userId || post.user_id;
    this.stuffId = post.stuffId || post.stuff_id;
    this.content = post.content;
    this.imageUrl = post.imageUrl || post.image_url;
    this.recommendedStuffId = post.recommendedStuffId || post.recommended_stuff_id;
    this.recommendedImageUrl = post.recommendedImageUrl || post.recommended_image_url;
    this.price = post.price;
    this.createdAt = post.createdAt || post.created_at;
    this.updatedAt = post.updatedAt || post.updated_at;

    // 팩토리나 생쿼리(snake_case) 대응을 위해 유연하게 필드 바인딩 
    this.nickname = post.nickname;
    this.profileImageUrl = post.profileImageUrl || post.profile_image_url;
    this.stuffName = post.stuffName || post.stuff_name;
    this.brandId = post.brandId || post.brand_id;
    this.brandName = post.brandName || post.brand_name;
    
    // 🎉 [핵심 추가] 메인 브랜드 로고 및 추천 조합 브랜드 로고
    this.brandLogoUrl = post.brandLogoUrl || post.brand_logo_url;
    this.recommendedBrandLogoUrl = post.recommendedBrandLogoUrl || post.recommended_brand_logo_url;
    
    // 추가 메타 정보들 (상세 페이지 대응용)
    this.recommendedStuffName = post.recommendedStuffName || post.recommended_stuff_name;
    this.recommendedBrandId = post.recommendedBrandId || post.recommended_brand_id;
    this.recommendedBrandName = post.recommendedBrandName || post.recommended_brand_name;
  }
}

module.exports = {
  CreatePostReqDTO,
  UpdatePostReqDTO,
  PostResDTO
};