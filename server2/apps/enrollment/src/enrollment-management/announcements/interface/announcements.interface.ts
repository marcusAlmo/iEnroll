export interface Announcements {
  receiveInput: {
    isActive: boolean;
    subject: string;
    contents: string;
  };

  prismaReturn: {
    is_active: boolean;
    subject: string;
    message: string;
  };
}
