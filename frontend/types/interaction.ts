export interface Interaction {
  
    reactionType: 'LIKE' | 'DISLIKE';
    commentId: number;
    text: string;
    parentCommentId: string;
    

  }