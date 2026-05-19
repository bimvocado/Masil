export interface Comment {
    commentId: number;
    postId: number;
    userId: number;
    test: string;
    parentCommentId: number;
    createdAt: string;
    isDeleted: Boolean;
  }