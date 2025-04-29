import { instance } from "@/lib/axios";

export const getFileDownloadablesByStudent = async () => {
  return await instance.get<
    {
      fileName: string;
      fileUrl: string;
    }[]
  >("/api/enrollment/dashboard/downloadables");
};

// TODO
// export const downloadDownloadableFiles = async () => {};
