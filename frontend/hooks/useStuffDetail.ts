import { useState, useEffect } from 'react';
import apiClient from '@/api/client';

export interface InteractionStat {
  total: number;
  korean: number;
  foreigner: number;
  ratio: number;
}

export interface StuffDetail {
  stuffId: number;
  stuffName: string;
  brandName: string;
  price: number;
  interactionStats: {
    total: number;
    like: InteractionStat;
    dislike: InteractionStat;
    myReaction: 'LIKE' | 'DISLIKE' | null;
  };
}

export function useStuffDetail(id: string) {
  const [loading, setLoading] = useState(true);
  const [detailData, setDetailData] = useState<StuffDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchStuffDetail = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/stuffs/${id}`);
        setDetailData(response.data.data);
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
    try {
      setDetailData((prev) => {
        if (!prev) return prev;
        const isSame = prev.interactionStats.myReaction === reactionType;
        return {
          ...prev,
          interactionStats: {
            ...prev.interactionStats,
            myReaction: isSame ? null : reactionType,
          }
        };
      });
      await apiClient.post(`/api/stuffs/${id}/interactions`, { reactionType });
    } catch (error) {
      console.error('반응 업데이트 에러:', error);
    }
  };

  return { loading, detailData, handleToggle };
}