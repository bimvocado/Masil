export interface Comment {
    commentId: number;
    postId: number;
    userId: number;
    text: string;
    parentCommentId: number;
    createdAt: string;
    isDeleted: Boolean;


    User?: {
      nickname: string;
      profileImageUrl?: string | null;
    };
  }