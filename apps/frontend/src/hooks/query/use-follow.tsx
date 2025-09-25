import { dynamicQueryEndpoint } from "@/lib/utils";
import followApis from "@/services/follow-services";
import type { QueryParams } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useGetFollowers = () => {
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
    queryKey: ["get-followers", query],
    queryFn: async () => {
      const res = await followApis.getFollowers(dynamicQueryEndpoint(query));
      return res?.data?.data;
    },
  });

  return {
    ...rest,
    updateQuery,
    query,
  };
};

export const useGetFollowing = () => {
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
    queryKey: ["get-following", query],
    queryFn: async () => {
      const res = await followApis.getFollowing(dynamicQueryEndpoint(query));
      return res?.data?.data;
    },
  });

  return {
    ...rest,
    updateQuery,
    query,
  };
};