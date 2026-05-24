export interface User {
    userId: number;
    loginId: string;
    nickname: string;
    email: string;
    profileImageUrl: string;
    isKorean: 'KOREAN' | 'FORIEGN';
    birthDate: string | Date;
    password: string;
    createdAt: string;
    updatedAt: string;
    deletdAt: string;



    bio: string;
  }