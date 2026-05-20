export interface Interaction {
  
    userId: number;
    stuffId: number;
    reactionType: 'LIKE' | 'DISLIKE';
    createdAt: string;
    updatedAt: string;


  }