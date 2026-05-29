

export interface Post {
    postId: number;  
    userId: number;
    stuffId: number;
    // title: string;
    content: string;      // 리뷰 본문 내용
    imageUrl?: string;    // 이미지 (있을수도 없을수도 있으니 ?)
    createdAt: string;   
    updatedAt: string;


    nickname?: string;      // 작성자 이름 (User 테이블에서 가져올 값)
    stuffName?: string;     // 상품명 (Stuff 테이블에서 가져올 값)
    brandName?: string;     // 브랜드명 (Brand 테이블에서 가져올 값)
    likeCount: number;     // Interaction 테이블에서 카운트할 값
    dislikeCount: number;  
    commentCount: number;  // Comment 테이블에서 카운트할 값
    isScrapped?: boolean;
    scrapCount?: number;
    brandId?: number;
  }