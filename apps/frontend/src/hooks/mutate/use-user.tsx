import userApis from "@/services/user-services";
import type { GetUserProfileResponse, UserUpdate } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { useToast } from "../logic/use-toast";
import { useGetUserProfile } from "../query/use-user";

export const useUpdateUserProfile = (cb?: () => void) => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const updateUserProfileMutation = createMutation<
        GetUserProfileResponse,
        UserUpdate,
        AxiosError<{ message: string }>
    >({
        mutationFn: async (variables: UserUpdate) => {
            const res = await userApis.updateUserProfile(variables);
            return res.data;
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({
                queryKey: useGetUserProfile.getKey(),
            });
            toast({
                description: data?.message,
            });
        },
        onError: (error) => {
            toast({
                description: error?.response?.data?.message,
                variant: "destructive",
            });
        },
        onSettled: () => {
            cb?.();
        },
    });

    return updateUserProfileMutation();
};
