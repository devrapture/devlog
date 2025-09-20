import { server } from "@/lib/axios-util";
import type { GetCategoriesResponse } from "@/types/api";

const categoryApis = {
  getCategories: () => server.get<GetCategoriesResponse>("categories"),
};

export default categoryApis;
