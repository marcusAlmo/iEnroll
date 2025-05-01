import { instance } from "@/lib/axios";
import { AnnouncementResponse } from "../types/announcement";

export const getAnnoucements = async () => {
  alert(import.meta.env.VITE_ENABLE_AXIOS)
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return instance.get<AnnouncementResponse>(
      "/api/enrollment/landing/announcement",
    );
  else
    return {
      data: [
        {
          subject: "Welcome Back to School!",
          message:
            "We are excited to welcome all students for the new academic year. Stay tuned for updates and events.",
          createdAt: new Date("2023-09-01T08:00:00Z"),
          updatedAt: new Date("2023-09-01T08:00:00Z"),
          schoolId: 101,
          schoolName: "Greenwood High School",
        },
        {
          subject: "Parent-Teacher Meeting Scheduled",
          message:
            "The next parent-teacher meeting is scheduled for September 15th at 5 PM in the school auditorium.",
          createdAt: new Date("2023-09-05T10:00:00Z"),
          updatedAt: new Date("2023-09-05T10:00:00Z"),
          schoolId: 101,
          schoolName: "Greenwood High School",
        },
        {
          subject: "Sports Day Announcement",
          message:
            "Join us for the annual Sports Day on October 10th. Let's cheer for our teams!",
          createdAt: new Date("2023-09-10T12:00:00Z"),
          updatedAt: new Date("2023-09-10T12:00:00Z"),
          schoolId: 101,
          schoolName: "Greenwood High School",
        },
      ],
    };
};
