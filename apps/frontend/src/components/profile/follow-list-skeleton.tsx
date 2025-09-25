import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Repeater from "../ui/repeater";

const FollowListSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Repeater count={4}>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="flex justify-between p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="min-w-0 flex-1 w-[140px]">
                <Skeleton className="mb-2 h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-9 w-20" /> {/* Button skeleton */}
          </CardContent>
        </Card>
      </Repeater>
    </div>
  );
};

export default FollowListSkeleton;
