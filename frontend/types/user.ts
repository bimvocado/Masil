export interface User {
    userId: string;
    loginId: string;
    nickname: string;
    profileImageUrl: string;
    bio: string;
    followerCount: number;
    followingCount: number;
    isKorean: 'KOREAN' | 'FORIEGN';
    birthDate: string;
    passwordHash: string;
  }