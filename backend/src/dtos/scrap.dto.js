class ToggleScrapReqDTO {
    constructor(userId, postId) {
        this.userId = userId;
        this.postId = Number(postId);
    }
}

class ToggleScrapResDTO {
    constructor(userId, postId, createdAt) {
        this.userId = userId;
        this.postId = postId;
        this.createdAt = createdAt;
    }
}

module.exports = {
    ToggleScrapReqDTO,
    ToggleScrapResDTO,
};