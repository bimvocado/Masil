export interface User {
    userId: number;
    loginId: string;
    nickname: string;
    email: string;
    profileImageUrl: string;
    isKorean: Boolean
    birthDate: string | Date;
    password: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;



    bio: string;
  }