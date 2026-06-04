class CreatePostReqDTO {
    constructor(content, imageUrl, userId, stuffId, price, recommendedStuffId, recommendedImageUrl) {
        this.content = content;
        this.imageUrl = imageUrl;
        this.userId = userId;
        this.stuffId = Number(stuffId);

        this.price =
            price === null || price === undefined || price === ''
                ? null
                : Number(price);

        this.recommendedStuffId =
            recommendedStuffId === null || recommendedStuffId === undefined || recommendedStuffId === ''
                ? null
                : Number(recommendedStuffId);

        this.recommendedImageUrl = recommendedImageUrl ?? null;
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
        this.postId = post.postId;
        this.content = post.content;
        this.imageUrl = post.imageUrl;
        this.userId = post.userId;
        this.stuffId = post.stuffId;
        this.price = post.price;

        this.recommendedStuffId = post.recommendedStuffId;
        this.recommendedStuffName = post.recommendedStuffName;
        this.recommendedBrandId = post.recommendedBrandId;
        this.recommendedBrandName = post.recommendedBrandName;
        this.recommendedImageUrl = post.recommendedImageUrl;

        this.createdAt = post.createdAt;
        this.updatedAt = post.updatedAt;
        this.nickname = post.nickname;
        this.stuffName = post.stuffName;
        this.brandName = post.brandName;

        this.isLiked = !!post.isLiked;
        this.isDisliked = !!post.isDisliked;
        this.isScrapped = !!post.isScrapped;

        this.likeCount = Number(post.likeCount || 0);
        this.dislikeCount = Number(post.dislikeCount || 0);
        this.commentCount = Number(post.commentCount || 0);
    }
}

module.exports = {
    CreatePostReqDTO,
    UpdatePostReqDTO,
    PostResDTO,
};