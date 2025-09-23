import followApis from "@/services/follow-services";
import type { SuccessResponse } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { useToast } from "../logic/use-toast";
import { useGetUserProfileById } from "../query/use-user";

export const useFollowUser = (cb?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const followUserMutation = createMutation<
    SuccessResponse,
    { id: string },
    AxiosError<{ message: string }>
  >({
    mutationFn: async (variables: { id: string }) => {
      const res = await followApis.followUser(variables.id);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: useGetUserProfileById.getKey(),
      });
      toast({
        description: "Followed successfully",
      });
      cb?.();
    },
    onError: (error) => {
      toast({
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    },
  });
  return followUserMutation();
};

export const useUnFollowUser = (cb?: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const unFollowUserMutation = createMutation<
    SuccessResponse,
    { id: string },
    AxiosError<{ message: string }>
  >({
    mutationFn: async (variables: { id: string }) => {
      const res = await followApis.unfollowUser(variables.id);
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: useGetUserProfileById.getKey(),
      });
      toast({
        description: "Unfollowed successfully",
      });
      cb?.();
    },
    onError: (error) => {
      toast({
        description: error?.response?.data?.message,
        variant: "destructive",
      });
    },
  });
  return unFollowUserMutation();
};
