"use client";

import { useGetFollowers } from "@/hooks/query/use-follow";
import UserCard from "./user-card";

const FollowersList = () => {
  const { data, isLoading } = useGetFollowers();
  const followers = data?.items;
  console.log("followers", followers);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {followers?.map((follower) => (
        <UserCard key={follower?.id} user={follower?.follower} />
      ))}
    </div>
  );
};

export default FollowersList;
