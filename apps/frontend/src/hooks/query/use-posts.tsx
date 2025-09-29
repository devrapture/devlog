import { dynamicQueryEndpoint } from "@/lib/utils";
import postApis from "@/services/post-services";
import type { QueryParams } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createQuery } from "react-query-kit";

export enum PostType {
    PUBLISHED = "published",
    DRAFT = "draft",
}

export const useGetMyPosts = (status: PostType) => {
    const [query, setQuery] = useState<QueryParams>({
        page: 1,
        status,
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
        queryKey: ["get-my-posts", query],
        queryFn: async () => {
            const res = await postApis.post.getAllMyPosts(
                dynamicQueryEndpoint(query),
            );
            return res?.data;
        },
    });

    return {
        ...rest,
        updateQuery,
        query,
    };
};

export const useGetAllPosts = () => {
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
        queryKey: ["get-all-posts", query],
        queryFn: async () => {
            const res = await postApis.post.getAllPosts(dynamicQueryEndpoint(query));
            return res?.data;
        },
    });

    return {
        ...rest,
        updateQuery,
        query,
    };
};

export const useGetPostByAuthor = (authorId: string) => {
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
        queryKey: ["get-post-by-author", authorId, query],
        queryFn: async () => {
            const res = await postApis.post.getPostByAuthor(authorId, dynamicQueryEndpoint(query));
            return res?.data;
        },
    });

    return {
        ...rest,
        updateQuery,
        query,
    };
};

export const useGetPostBySlug = createQuery({
    queryKey: ["get-post-by-slug"],
    fetcher: async (variables: { slug: string }) => {
        const res = await postApis.post.getPostBySlug(variables.slug);
        return res?.data?.data;
    },
});


export const useGetDraftById = createQuery({
    queryKey: ["get-draft-by-id"],
    fetcher: async (variables: { draftId: string }) => {
        const res = await postApis.draft.getDraftById(variables.draftId);
        return res?.data?.data;
    },
});
