class CreatePostReqDTO {
    constructor(content, imageUrl, userId, stuffId) {
        this.content = content;
        this.imageUrl = imageUrl;
        this.userId = userId;
        this.stuffId = Number(stuffId);
    }
}

class UpdatePostReqDTO {
    constructor(content, imageUrl) {
        this.content = content,
        this.imageUrl = imageUrl;
    }
}
class PostResDTO {
    constructor(post) {
        this.postId = post.postId;
        this.content = post.content;
        this.imageUrl = post.imageUrl;
        this.userId = post.userId;
        this.stuffId = post.stuffId;
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