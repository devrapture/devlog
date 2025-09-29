import { serverWithInterceptors } from "@/lib/axios-util";
import type { GetDraftByIdResponse, GetPostBySlugResponse, Post, PostResponse, PublishPostResponse, SingleResponse } from "@/types/api";

export interface CreatePostDto {
  title?: string;
  body?: string;
  categories?: string[];
  coverImage?: string;
}

export interface PublishPostDto {
  title: string;
  body: string;
  categories: string[];
  coverImage: string;
}

const postApis = {
  delete: (id: string) => serverWithInterceptors.delete<Post>(`/posts/${id}`),
  draft: {
    create: () => serverWithInterceptors.post<GetDraftByIdResponse>("/posts/draft"),
    update: (draftId: string, data: CreatePostDto) =>
      serverWithInterceptors.patch<Post>(`/posts/draft/${draftId}`, data),
    getById: (draftId: string) =>
      serverWithInterceptors.get<Post>(`/posts/draft/${draftId}`),
    publishDraft: (draftId: string) =>
      serverWithInterceptors.patch<SingleResponse>(`/posts/publish-existing/${draftId}`),
    getAll: (query: string) =>
      serverWithInterceptors.get<PostResponse>(`/posts/draft${query}`),
    getDraftById: (draftId: string) =>
      serverWithInterceptors.get<GetDraftByIdResponse>(`/posts/draft/${draftId}`),
  },
  post: {
    publish: (draftId: string, data: PublishPostDto) =>
      serverWithInterceptors.patch<PublishPostResponse>(`/posts/publish/${draftId}`, data),
    revertToDraft: (postId: string) =>
      serverWithInterceptors.patch<SingleResponse>(`/posts/revert/${postId}`),
    getAllMyPosts: (query: string) =>
      serverWithInterceptors.get<PostResponse>(`/posts/me${query}`),
    getPostBySlug: (slug: string) =>
      serverWithInterceptors.get<GetPostBySlugResponse>(`/posts/${slug}`),
    getAllPosts: (query: string) =>
      serverWithInterceptors.get<PostResponse>(`/posts${query}`),
    getPostByAuthor: (authorId: string, query: string) =>
      serverWithInterceptors.get<PostResponse>(`/posts/${authorId}${query}`),
  },
};

export default postApis;
