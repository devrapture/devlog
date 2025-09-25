import { useGetFollowing } from "@/hooks/query/use-follow";
import SkeletonWrapper from "../ui/skeleton-wrapper";
import FollowListSkeleton from "./follow-list-skeleton";
import UserCard from "./user-card";

const FollowingList = () => {
  const { data, isLoading } = useGetFollowing();
  const following = data?.items;
  return (
    <SkeletonWrapper
      isEmpty={!following}
      isLoading={isLoading}
      Loader={FollowListSkeleton}
      EmptyComponent={<div>No following</div>}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {following?.map((follower) => (
          <UserCard key={follower?.id} user={follower?.following} />
        ))}
      </div>
    </SkeletonWrapper>
  );
};

export default FollowingList;
