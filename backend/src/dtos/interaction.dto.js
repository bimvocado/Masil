class ToggleInteractionReqDTO {
    constructor(userId, stuffId, reactionType) {
        this.userId = userId;
        this.stuffId = Number(stuffId);
        this.reactionType = reactionType.toUpperCase();
    }
}

class InteractionResDTO {
    constructor(userId, stuffId, reactionType, createdAt) {
        this.userId = userId;
        this.stuffId = stuffId;
        this.reactionType = reactionType;
        this.createdAt = createdAt;
    }
}

module.exports = {
    ToggleInteractionReqDTO,
    InteractionResDTO,
};
