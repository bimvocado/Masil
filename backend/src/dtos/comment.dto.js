class CreateCommentReqDTO {
    constructor({ userId, postId, text, parentCommentId = null }) {
        this.userId = userId;
        this.postId = Number(postId);
        this.text = text;
        this.parentCommentId = parentCommentId ? Number(parentCommentId) : null; // 부모 댓글 ID는 선택적이며, 없을 경우 null로 설정 (대댓글 처리용)
    }
}

class CommentResDTO {
    constructor({ commentId, userId, postId, text, parentCommentId, createdAt }) {
        this.commentId = commentId;
        this.userId = userId;
        this.postId = postId;
        this.text = text;
        this.parentCommentId = parentCommentId;
        this.createdAt = createdAt;
    }
}

module.exports = {
    CreateCommentReqDTO,
    CommentResDTO,
};