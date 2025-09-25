import { serverWithInterceptors } from "@/lib/axios-util";
import type { ApiBaseResponse } from "@/types/api";

export interface MediaFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  publicId: string;
  altText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadFileRequest {
  file: File;
  altText?: string;
}

export type UploadFileResponse = ApiBaseResponse<MediaFile>;

const fileUploadApis = {
  uploadFile: (data: UploadFileRequest) => {
    const formData = new FormData();
    formData.append("file", data.file);
    if (data.altText) {
      formData.append("altText", data.altText);
    }

    return serverWithInterceptors.post<UploadFileResponse>(
      "/file-upload",
      formData,
    );
  },
};

export default fileUploadApis;
