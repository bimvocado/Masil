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
        // Support multiple backend response shapes: { data: { ... } } or { result: { ... } }
        const responseData = response.data?.data ?? response.data?.result;

        if (!responseData) {
          console.warn('[useStuffDetail] unexpected response shape', response.data);
          setDetailData(null);
          return;
        }

        // If API returns modern shape (data.*), it likely already matches expected fields.
        if (response.data?.data) {
          const detailObj: any = {
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
          };

          try {
            const statsResp = await apiClient.get(`/api/interactions/${id}/interactions`);
            const statsData = statsResp.data?.data ?? statsResp.data?.result ?? statsResp.data;
            const myReaction = statsData?.myReaction ?? null;
            if (myReaction !== undefined && myReaction !== null) {
              detailObj.myReaction = myReaction;
            }
          } catch (err) {
            // ignore optional auth / stats errors
          }

          setDetailData(detailObj);
        } else {
          // Legacy DTO from backend: map fields to the hook's expected shape
          const mapped = {
            stuffId: responseData.stuffId,
            stuffName: responseData.stuffName,
            brandId: responseData.brandId,
            brandName: responseData.brandName,
            price: responseData.price,
            // keep legacy compatibility: provide both `imageUrl` and `bestReviewImageUrl`
            bestReviewImageUrl: getAbsoluteUrl(responseData.imageUrl ?? null),
            imageUrl: getAbsoluteUrl(responseData.imageUrl ?? null),
            likeCount: Number(responseData.totalLikeCount || 0),
            dislikeCount: Number(responseData.totalDislikeCount || 0),
            koreanLikeCount: Number(responseData.koreanLikeCount || 0),
            foreignLikeCount: Number(responseData.foreignerLikeCount || 0),
            koreanDislikeCount: Number(responseData.koreanDislikeCount || 0),
            foreignerDislikeCount: Number(responseData.foreignerDislikeCount || 0),
            recommendedStuffs: responseData.recommendedStuffs ?? [],
            bestReview: responseData.topPost
              ? {
                  postId: responseData.topPost.postId,
                  content: responseData.topPost.content,
                  imageUrl: getAbsoluteUrl(responseData.topPost.imageUrl),
                  createdAt: responseData.topPost.createdAt,
                  likeCount: 0,
                  dislikeCount: 0,
                  user: {
                    userId: responseData.topPost.userId,
                    nickname: responseData.topPost.nickname,
                    profileImageUrl: null,
                  },
                }
              : null,
            // product page expects `topPost` field
            topPost: responseData.topPost
              ? {
                  postId: responseData.topPost.postId,
                  content: responseData.topPost.content,
                  imageUrl: getAbsoluteUrl(responseData.topPost.imageUrl),
                  userId: responseData.topPost.userId,
                  nickname: responseData.topPost.nickname,
                  scrapCount: Number(responseData.topPost.scrapCount || 0),
                  createdAt: responseData.topPost.createdAt,
                }
              : null,
            myReaction: null,
          } as any;

          try {
            const statsResp = await apiClient.get(`/api/interactions/${id}/interactions`);
            const statsData = statsResp.data?.data ?? statsResp.data?.result ?? statsResp.data;
            const myReaction = statsData?.myReaction ?? null;
            if (myReaction !== undefined && myReaction !== null) {
              mapped.myReaction = myReaction;
            }
          } catch (err) {
            // ignore
          }

          setDetailData(mapped);
        }
      } catch (error) {
        console.error('상품 상세 로딩 에러:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStuffDetail();
  }, [id]);

  const handleToggle = async (reactionType: 'LIKE' | 'DISLIKE') => {
    console.log('[useStuffDetail] handleToggle called', { id, reactionType, currentReaction: detailData?.myReaction });
    if (!detailData) {
      console.warn('[useStuffDetail] detailData is null, toggle skipped');
      return;
    }
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

      console.log('[useStuffDetail] sending request', `/api/interactions/${id}/interactions`, reactionType);
      const response = await apiClient.post(`/api/interactions/${id}/interactions`, { reactionType });
      console.log('[useStuffDetail] request response', response.status, response.data);
    } catch (error: any) {
      console.error('반응 업데이트 에러:', error);
      if (error.response) {
        console.error('API error response:', error.response.status, error.response.data);
      }
    }
  };

  return { loading, detailData, handleToggle };
}