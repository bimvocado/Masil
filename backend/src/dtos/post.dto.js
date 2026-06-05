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
  }
}

module.exports = {
  CreatePostReqDTO,
  UpdatePostReqDTO,
  PostResDTO
};