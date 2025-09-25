import { serverWithInterceptors } from "@/lib/axios-util";
import type {
  GetUserFollowersResponse,
  GetUserFollowingResponse,
  SuccessResponse,
} from "@/types/api";

const followApis = {
  followUser: (id: string) =>
    serverWithInterceptors.post<SuccessResponse>(`/follows/${id}`),
  unfollowUser: (id: string) =>
    serverWithInterceptors.delete<SuccessResponse>(`/follows/${id}`),
  getFollowers: (query: string) =>
    serverWithInterceptors.get<GetUserFollowersResponse>(
      `follows/followers${query}`,
    ),
  getFollowing: (query: string) =>
    serverWithInterceptors.get<GetUserFollowingResponse>(
      `/follows/following${query}`,
    ),
};

export default followApis;
