import { useState, useEffect } from 'react';
import apiClient from '@/api/client';
import { BASE_URL } from '@/api/auth-service';

const getAbsoluteUrl = (url: string | null | undefined) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

export interface StuffDetail {
  stuffId: number;
  stuffName: string;
  brandId: number;
  brandName: number;
  price: number;
  bestReviewImageUrl: string | null;
  likeCount: number;
  dislikeCount: number;
  koreanLikeCount: number;
  foreignLikeCount: number;
  recommendedStuffs: Array<{
    stuffId: number;
    stuffName: string;
    price: number;
    likeCount: number;
    dislikeCount: number;
  }>;
  bestReview: {
    postId: number;
    content: string;
    imageUrl: string | null;
    createdAt: string;
    likeCount: number;
    dislikeCount: number;
    user: {
      userId: number;
      nickname: string;
      profileImageUrl: string | null;
    };
  } | null;
  myReaction?: 'LIKE' | 'DISLIKE' | null;
}

export function useStuffDetail(id: string) {
  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState<StuffDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchStuffDetail = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/stuffs/${id}/detail`);
        const responseData = response.data.data;
        setDetailData({
          ...responseData,
          bestReviewImageUrl: getAbsoluteUrl(responseData.bestReviewImageUrl),
          bestReview: responseData.bestReview
            ? {
                ...responseData.bestReview,
                imageUrl: getAbsoluteUrl(responseData.bestReview.imageUrl),
                user: {
                  ...responseData.bestReview.user,
                  profileImageUrl: getAbsoluteUrl(responseData.bestReview.user.profileImageUrl),
                },
              }
            : null,
          myReaction: responseData.myReaction ?? null,
        });
      } catch (error) {
        console.error('상품 상세 로딩 에러:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStuffDetail();
  }, [id]);

  const handleToggle = async (reactionType: 'LIKE' | 'DISLIKE') => {
    if (!detailData) return;
    const prevReaction = detailData.myReaction || null;
    const isSame = prevReaction === reactionType;

    try {
      setDetailData((prev) => {
        if (!prev) return prev;

        let likeCount = prev.likeCount;
        let dislikeCount = prev.dislikeCount;

        if (prevReaction === 'LIKE') likeCount = Math.max(0, likeCount - 1);
        if (prevReaction === 'DISLIKE') dislikeCount = Math.max(0, dislikeCount - 1);

        if (!isSame) {
          if (reactionType === 'LIKE') likeCount += 1;
          if (reactionType === 'DISLIKE') dislikeCount += 1;
        }

        return {
          ...prev,
          myReaction: isSame ? null : reactionType,
          likeCount,
          dislikeCount,
        };
      });
      await apiClient.post(`/api/interactions/${id}/interactions`, { reactionType });
    } catch (error) {
      console.error('반응 업데이트 에러:', error);
    }
  };

  return { loading, detailData, handleToggle };
}