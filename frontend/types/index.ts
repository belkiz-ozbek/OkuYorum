export interface ReadingActivity {
  id: number;
  userId: number;
  activityDate: string;
  booksRead: number;
  pagesRead: number;
  readingMinutes: number;
  lastReadDate: string;
  consecutiveDays: number;
  createdAt: string;
  updatedAt: string;
} 