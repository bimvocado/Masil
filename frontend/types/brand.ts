export interface Brand {
    brandId: number;
    brandName: string;
    category: 'FOOD' | 'STUFF';
    logoUrl?: string;     // 브랜드 로고 이미지
    postCount?: number;   // 이 브랜드에 달린 게시글 수
  }