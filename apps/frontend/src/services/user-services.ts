import { serverWithInterceptors } from "@/lib/axios-util";
import type { GetUserProfileByIdResponse, GetUserProfileResponse, UserUpdate } from "@/types/api";

const userApis = {
  getUserProfile: () =>
    serverWithInterceptors.get<GetUserProfileResponse>("/users"),
  updateUserProfile: (data: UserUpdate) =>
    serverWithInterceptors.patch<GetUserProfileResponse>("/users", data),
  getUserProfileById: (id: string) =>
    serverWithInterceptors.get<GetUserProfileByIdResponse>(`/users/${id}`),
};

export default userApis;
