import FollowListSkeleton from "@/components/profile/follow-list-skeleton";
import UserCard from "@/components/profile/user-card";
import SkeletonWrapper from "@/components/ui/skeleton-wrapper";
import { useGetFollowingForUser } from "@/hooks/query/use-follow";
import { useParams } from "next/navigation";

const FollowingList = () => {
  const { userId } = useParams();
  const { data, isLoading } = useGetFollowingForUser(String(userId));
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
