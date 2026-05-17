const { CommentResDTO } = require('../dtos/comment.dto');

const toCommentResDTO = (commentEntity) => {
    return new CommentResDTO({
        commentId: commentEntity.commentId,
        userId: commentEntity.userId,
        postId: commentEntity.postId,
        text: commentEntity.text,
        parentCommentId: commentEntity.parentCommentId,
        createdAt: commentEntity.createdAt,
    });
};

//댓글 목록 조회 시 배열 전체 변환
const toCommentResDTOList = (commentEntities) => {
    return commentEntities.map((commentEntity) => toCommentResDTO(commentEntity));
};

module.exports = {
    toCommentResDTO,
    toCommentResDTOList,
};