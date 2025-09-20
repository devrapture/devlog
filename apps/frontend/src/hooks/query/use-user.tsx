import userApis from "@/services/user-services";
import { createQuery } from "react-query-kit";

export const useGetUserProfile = createQuery({
  queryKey: ["getUserProfile"],
  fetcher: async () => {
    const response = await userApis.getUserProfile();
    return response.data?.data;
  },
});
