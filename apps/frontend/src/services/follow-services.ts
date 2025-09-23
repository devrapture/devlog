import { serverWithInterceptors } from "@/lib/axios-util";
import type { SuccessResponse } from "@/types/api";

const followApis = {
  followUser: (id: string) =>
    serverWithInterceptors.post<SuccessResponse>(`/follows/${id}`),
  unfollowUser: (id: string) =>
    serverWithInterceptors.delete<SuccessResponse>(`/follows/${id}`),
  getFollowers: () =>
    serverWithInterceptors.get<SuccessResponse>(`follows/followers`),
  getFollowing: (id: string) =>
    serverWithInterceptors.get<SuccessResponse>(`/follows/${id}/following`),
};

export default followApis;
