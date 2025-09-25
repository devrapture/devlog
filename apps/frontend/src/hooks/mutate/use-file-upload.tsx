import type { MediaFile, UploadFileRequest } from "@/services/file-upload-services";
import fileUploadApis from "@/services/file-upload-services";
import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { useToast } from "../logic/use-toast";

export const useUploadFile = (cb?: () => void) => {
    const { toast } = useToast();

    const uploadFileMutation = createMutation<
        MediaFile,
        UploadFileRequest,
        AxiosError<{ message: string }>
    >({
        mutationFn: async (variables: UploadFileRequest) => {
            const res = await fileUploadApis.uploadFile(variables);
            return res.data.data;
        },
        onSuccess: (data) => {
            toast({
                description: "File uploaded successfully",
            });
            cb?.();
        },
        onError: (error) => {
            toast({
                description: error?.response?.data?.message ?? "Failed to upload file",
                variant: "destructive",
            });
        },
    });

    return uploadFileMutation();
};
