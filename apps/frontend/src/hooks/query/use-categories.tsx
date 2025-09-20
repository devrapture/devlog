import categoryApis from "@/services/category-services";
import { createQuery } from "react-query-kit";

export const useGetCategories = createQuery({
  queryKey: ["getCategories"],
  fetcher: async () => {
    const response = await categoryApis.getCategories();
    return response.data?.data;
  },
});
