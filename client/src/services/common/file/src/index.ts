import { instance } from "@/lib/axios";

export const getFile = async (fileUrl: string) => {
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_AXIOS === "true")
    return await instance.get<Blob>(fileUrl, {
      responseType: "blob",
    });
  else {
    const proxy = "https://corsproxy.io/?";
    const response = await fetch(`${proxy}${encodeURIComponent(fileUrl)}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch file: ${response.status} ${response.statusText}`,
      );
    }
    return { data: await response.blob() };
  }
};
