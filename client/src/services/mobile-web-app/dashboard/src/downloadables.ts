import { instance } from "@/lib/axios";

export const getFileDownloadablesByStudent = async () => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return await instance.get<
      {
        fileName: string;
        fileUrl: string;
      }[]
    >("/api/enrollment/dashboard/downloadables");
  else
    return {
      data: [
        {
          fileName: "sample.jpg",
          fileUrl:
            "https://imgv2-1-f.scribdassets.com/img/document/471922303/original/280703d8e2/1?v=1",
        },
      ],
    };
};

// TODO
// export const downloadDownloadableFiles = async () => {};
