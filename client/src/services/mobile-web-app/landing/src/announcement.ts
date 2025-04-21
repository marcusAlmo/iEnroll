import { instance } from "@/lib/axios";
import { AnnouncementResponse } from "../types/announcement";

export const getAnnoucements = async () => {
  return instance.get<AnnouncementResponse>(
    "/api/enrollment/landing/announcement",
  );
};
