

export interface Post {
    postId: number;           // 게시물 고유 ID
    brandId: string;    // 브랜드 이름 (ex: 롯데리아)
    stuffName: string;  // 상품 이름 (ex: 새우버거)
    content: string;      // 리뷰 본문 내용
    imageUrl?: string;    // 이미지 (있을수도 없을수도 있으니 ?)
    likeCount: number;    // 좋아요 숫자
    commentCount: number; // 댓글 숫자
    createdAt: string;    // 작성일자 (ex: 2024.05.19)
    tags: string[];       // 추천 조합 태그 (ex: ['@콜라', '@감튀'])
    isHearted?: boolean;
  }