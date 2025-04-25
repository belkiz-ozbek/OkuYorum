export type UserProfile = {
    id: number;
    nameSurname: string;
    username: string;
    email: string;
    bio: string;
    birthDate: string;
    profileImage: string | null;
    headerImage: string | null;
    followers: number;
    following: number;
    booksRead: number;
    readerScore: number;
    yearlyGoal: number;
    readingHours: number;
    createdAt: string;
    updatedAt: string;
}; 