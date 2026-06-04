import { useState, useEffect } from 'react';
import apiClient from '@/api/client';
// import { BASE_URL } from '@/api/auth-service';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://supermasil.duckdns.org';export const API_URL = BASE_URL;

const getAbsoluteUrl = (url: string | null | undefined) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${BASE_URL}${url}`;
};

export interface StuffDetail {
  stuffId: number;
  stuffName: string;
  brandId: number;
  brandName: string;
  price: number;
  bestReviewImageUrl: string | null;
  imageUrl?: string | null;

  // recommendedStuffId?: number | null;
  // recommendedStuffName?: string | null;
  // recommendedBrandId?: number | null;
  // recommendedBrandName?: string | null;
  // recommendedImageUrl?: string | null;
  
  likeCount: number;
  likeRatio: number;
  koreanLikeCount: number;
  foreignerLikeCount: number;

  dislikeCount: number;
  dislikeRatio: number;
  koreanDislikeCount: number;
  foreignerDislikeCount: number;

  recommendedStuffs: any[];
  bestReview: any | null;
  // topPost?: any | null;

  topPost?: {
    postId: number;
    userId: number;
    nickname: string;
    content: string;
    imageUrl: string | null;
    scrapCount: number;
    createdAt: string;

    recommendedStuffId?: number | null;
    recommendedStuffName?: string | null;
    recommendedBrandId?: number | null;
    recommendedBrandName?: string | null;
    recommendedImageUrl?: string | null;
  } | null;
  
  myReaction?: 'LIKE' | 'DISLIKE' | null;
  isKorean?: boolean | null;
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
        const responseData = response.data?.data ?? response.data?.result;

        console.log('responseData', responseData);
        console.log('responseData.topPost', responseData.topPost);

        if (!responseData) {
          setDetailData(null);
          return;
        }

        // 기본 매핑 객체 생성
        let mapped: any = {
          ...responseData,
          brandName: String(responseData.brandName || '브랜드 미정'),
          imageUrl: getAbsoluteUrl(responseData.imageUrl ?? null),
          bestReviewImageUrl: getAbsoluteUrl(responseData.bestReviewImageUrl ?? responseData.imageUrl ?? null),
          
          // 기본값 0으로 세팅
          likeCount: Number(responseData.totalLikeCount || responseData.likeCount || 0),
          likeRatio: 0,
          koreanLikeCount: Number(responseData.koreanLikeCount || 0),
          foreignerLikeCount: Number(responseData.foreignerLikeCount || responseData.foreignLikeCount || 0),
          
          dislikeCount: Number(responseData.totalDislikeCount || responseData.dislikeCount || 0),
          dislikeRatio: 0,
          koreanDislikeCount: Number(responseData.koreanDislikeCount || 0),
          foreignerDislikeCount: Number(responseData.foreignerDislikeCount || 0),
          
          topPost: responseData.topPost || responseData.bestReview || null,
          myReaction: responseData.myReaction ?? null,
        };

        try {
          const statsResp = await apiClient.get(`/api/interactions/${id}/interactions`);
          const statsData = statsResp.data?.data?.stats ?? statsResp.data?.stats;
          const myReaction = statsResp.data?.data?.myReaction ?? statsResp.data?.myReaction ?? null;
const isKor = statsResp.data?.data?.isKorean ?? statsResp.data?.isKorean;

          if (statsData) {
            mapped.likeCount = statsData.like.total;
            mapped.likeRatio = statsData.like.ratio;
            mapped.koreanLikeCount = statsData.like.korean;
            mapped.foreignerLikeCount = statsData.like.foreigner;

            mapped.dislikeCount = statsData.dislike.total;
            mapped.dislikeRatio = statsData.dislike.ratio;
            mapped.koreanDislikeCount = statsData.dislike.korean;
            mapped.foreignerDislikeCount = statsData.dislike.foreigner;
            mapped.isKorean = isKor;
          }
          if (myReaction !== undefined && myReaction !== null) {
            mapped.myReaction = myReaction;
          }
        } catch (err) {
          console.warn('통계 초기 로딩 실패 (무시됨)');
        }

        setDetailData(mapped);

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
        return { ...prev, myReaction: isSame ? null : reactionType };
      });

      const response = await apiClient.post(`/api/interactions/${id}/interactions`, { reactionType });
      const statsData = response.data?.data?.stats ?? response.data?.stats;
      const isKor = response.data?.data?.isKorean ?? response.data?.isKorean;
      if (statsData) {
        setDetailData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            likeCount: statsData.like.total,
            likeRatio: statsData.like.ratio, 
            koreanLikeCount: statsData.like.korean,
            foreignerLikeCount: statsData.like.foreigner,
            
            dislikeCount: statsData.dislike.total,
            dislikeRatio: statsData.dislike.ratio, 
            koreanDislikeCount: statsData.dislike.korean,
            foreignerDislikeCount: statsData.dislike.foreigner,
            isKorean: isKor,
          };
        });
      }
    } catch (error: any) {
      console.error('반응 업데이트 에러:', error);
    }
  };

  return { loading, detailData, handleToggle };
}