import { create } from 'zustand';

export type BrandCategory = 'FOOD' | 'HOUSEHOLD';
export type StuffSort = 'LIKE_DESC' | 'DISLIKE_ASC' | 'LATEST';

export interface Brand {
  brandId: number;
  brandName: string;
  logoUrl: string;
  category: BrandCategory;
}

export interface Stuff {
  rank?: number;
  stuffId: number;
  brandId?: number;
  stuffName: string;
  price: number;

  imageUrl?: string | null;

  likeCount: number;
  dislikeCount: number;
  postCount: number;

  createdAt?: string;
}

// 상단 대표 이미지
export interface TopPost {
  postId: number;
  content: string;
  imageUrl: string | null;
  userId: number;
  nickname: string;
  scrapCount: number;
  createdAt: string;
}

// 상품창 - 상세 페이지 전체
export interface StuffDetail {
  stuffId: number;
  stuffName: string;
  price: number;

  brandId: number;
  brandName: string;
  logoUrl?: string | null;

  imageUrl: string | null;

  totalLikeCount: number;
  koreanLikeCount: number;
  foreignerLikeCount: number;

  totalDislikeCount: number;
  koreanDislikeCount: number;
  foreignerDislikeCount: number;

  totalPostCount: number;

  topPost: TopPost | null;
}

interface SearchState {
  brands: Brand[];
  stuffs: Stuff[];
  stuffDetail: StuffDetail | null;

  brandName: string;
  totalElements: number;

  loading: boolean;
  error: string | null;

  setBrands: (brands: Brand[]) => void;
  setStuffs: (stuffs: Stuff[]) => void;
  setStuffDetail: (stuffDetail: StuffDetail | null) => void;

  setBrandInfo: (brandName: string, totalElements: number) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  clearSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  brands: [],
  stuffs: [],
  stuffDetail: null,

  brandName: '',
  totalElements: 0,

  loading: false,
  error: null,

  setBrands: (brands) =>
    set({
      brands,
    }),

  setStuffs: (stuffs) =>
    set({
      stuffs,
    }),

  setStuffDetail: (stuffDetail) =>
    set({
      stuffDetail,
    }),

  setBrandInfo: (brandName, totalElements) =>
    set({
      brandName,
      totalElements,
    }),

  setLoading: (loading) =>
    set({
      loading,
    }),

  setError: (error) =>
    set({
      error,
    }),

  clearSearch: () =>
    set({
      brands: [],
      stuffs: [],
      stuffDetail: null,
      brandName: '',
      totalElements: 0,
      loading: false,
      error: null,
    }),
}));