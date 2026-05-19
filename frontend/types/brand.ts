export interface Brand {
    brandId: number;
    brandName: string;
    category: 'FOOD' | 'STUFF';
    logoUrl?: string;    
    //postCount?: number;   // 이 브랜드에 달린 게시글 수
    createdAt: string;
    updatedAt: string;
    deletdAt: string;
  }