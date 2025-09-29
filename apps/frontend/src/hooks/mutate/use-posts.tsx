import postApis, {
  type CreatePostDto,
  type PublishPostDto,
} from "@/services/post-services";
import type {
  GetDraftByIdResponse,
  Post,
  PublishPostResponse,
  SingleResponse
} from "@/types/api";
import type { AxiosError } from "axios";
import { createMutation } from "react-query-kit";
import { useToast } from "../logic/use-toast";

export const useDeletePost = (cb?: () => Promise<void>) => {
  const { toast } = useToast();

  const deletePostMutation = createMutation<
    Post,
    { id: string },
    AxiosError<{ message: string }>
  >({
    mutationFn: async (variables: { id: string }) => {
      const res = await postApis.delete(variables.id);
      return res.data;
    },
    onSuccess: async () => {
      await cb?.();
      toast({
        description: "Post deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        description:
          error?.response?.data?.message ??
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  return deletePostMutation();
};

export const usePublishDraft = (cb?: () => Promise<void>) => {
  const { toast } = useToast();

  const publishDraftMutation = createMutation<
  SingleResponse,
    { id: string },
    AxiosError<{ message: string }>
  >({
    mutationFn: async (variables: { id: string }) => {
      const res = await postApis.draft.publishDraft(variables.id);
      return res.data;
    },
    onSuccess: async () => {
      await cb?.();
      toast({
        description: "Draft published successfully",
      });
    },
    onError: (error) => {
      toast({
        description:
          error?.response?.data?.message ??
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  return publishDraftMutation();
};

export const useCreateDraft = (cb?: () => Promise<void>) => {
  const { toast } = useToast();

  const createDraftMutation = createMutation<
    GetDraftByIdResponse,
    void,
    AxiosError<{ message: string }>
  >({
    mutationFn: async () => {
      const res = await postApis.draft.create();
      return res.data;
    },
    onSuccess: async () => {
      await cb?.();
      toast({
        description: "Draft created successfully",
      });
    },
    onError: (error) => {
      toast({
        description:
          error?.response?.data?.message ??
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  return createDraftMutation();
};

export const useUpdateDraft = (cb?: () => Promise<void>) => {
  const { toast } = useToast();

  const updateDraftMutation = createMutation<
    Post,
    { draftId: string; data: CreatePostDto },
    AxiosError<{ message: string }>
  >({
    mutationFn: async (variables) => {
      const res = await postApis.draft.update(
        variables.draftId,
        variables.data,
      );
      return res.data;
    },
    onSuccess: async () => {
      await cb?.();
      toast({
        description: "Draft updated successfully",
      });
    },
    onError: (error) => {
      toast({
        description:
          error?.response?.data?.message ??
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  return updateDraftMutation();
};

export const usePublishPost = (cb?: () => Promise<void>) => {
  const { toast } = useToast();

  const publishPostMutation = createMutation<
    PublishPostResponse,
    { draftId: string; data: PublishPostDto },
    AxiosError<{ message: string }>
  >({
    mutationFn: async (variables) => {
      const res = await postApis.post.publish(
        variables.draftId,
        variables.data,
      );
      return res.data;
    },
    onSuccess: async () => {
      await cb?.();
      toast({
        description: "Post published successfully",
      });
    },
    onError: (error) => {
      toast({
        description:
          error?.response?.data?.message ??
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  return publishPostMutation();
};

export const useRevertToDraft = (cb?: () => Promise<void>) => {
  const { toast } = useToast();

  const revertToDraftMutation = createMutation<
    SingleResponse,
    { postId: string },
    AxiosError<{ message: string }>
  >({
    mutationFn: async (variables: { postId: string }) => {
      const res = await postApis.post.revertToDraft(variables.postId);
      return res.data;
    },
    onSuccess: async () => {
      await cb?.();
      toast({
        description: "Post reverted to draft successfully",
      });
    },
    onError: (error) => {
      toast({
        description:
          error?.response?.data?.message ??
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
  return revertToDraftMutation();
};
