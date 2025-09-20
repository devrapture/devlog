import { serverWithInterceptors } from "@/lib/axios-util";
import type { GetUserProfileResponse } from "@/types/api";

const userApis = {
    getUserProfile: () => serverWithInterceptors.get<GetUserProfileResponse>("/users"),
}

export default userApis;