import userApis from "@/services/user-services";
import { createQuery } from "react-query-kit";

export const useGetUserProfile = createQuery({
  queryKey: ["getUserProfile"],
  fetcher: async () => {
    const response = await userApis.getUserProfile();
    return response.data?.data;
  },
});

export const useGetUserProfileById = createQuery({
  queryKey: ["getUserProfileById"],
  fetcher: async (variables: { id: string }) => {
    const response = await userApis.getUserProfileById(variables.id);
    return response.data?.data;
  },
});


export const useGetBooking = () => {
  const [query, setQuery] = useState<QueryParams>({
    page: 1,
  });
  const updateQuery = <K extends keyof QueryParams>(
    field: K,
    value: QueryParams[K],
  ) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      [field]: value,
    }));
  };

  const { ...rest } = useQuery({
    queryKey: ["get-booking", query],
    queryFn: async () => {
      const res = await apis.booking.fetch(
        // @ts-expect-error type error
        dynamicQueryEndpoint(query),
      );
      return res.data?.data;
    },
  });

  return {
    ...rest,
    updateQuery,
    query,
  };
};