interface Announcement {
  subject: string;
  message: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  schoolId: number;
  schoolName: string;
}

export type AnnouncementResponse = Announcement[];
