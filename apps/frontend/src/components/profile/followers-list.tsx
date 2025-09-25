"use client";

import { useGetFollowers } from "@/hooks/query/use-follow";
import UserCard from "./user-card";
import SkeletonWrapper from "../ui/skeleton-wrapper";
import FollowListSkeleton from "./follow-list-skeleton";

const FollowersList = () => {
  const { data, isLoading } = useGetFollowers();
  const followers = data?.items;
  return (
    <SkeletonWrapper
      isEmpty={!followers}
      isLoading={isLoading}
      Loader={FollowListSkeleton}
      EmptyComponent={<div>No following</div>}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {followers?.map((follower) => (
          <UserCard key={follower?.id} user={follower?.follower} />
        ))}
      </div>
    </SkeletonWrapper>
  );
};

export default FollowersList;
