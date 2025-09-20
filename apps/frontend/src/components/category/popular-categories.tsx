import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetCategories } from "@/hooks/query/use-categories";
import Repeater from "../ui/repeater";
import { Skeleton } from "../ui/skeleton";
import SkeletonWrapper from "../ui/skeleton-wrapper";

const PopularCategories = () => {
  const { isLoading, data } = useGetCategories();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <SkeletonWrapper
          isLoading={isLoading}
          Loader={
            <div className="flex flex-wrap gap-2">
              <Repeater count={5}>
                <Skeleton className="h-3 w-20 rounded-full" />
              </Repeater>
            </div>
          }
        >
          <div className="flex flex-wrap gap-2">
            {data?.map((category) => (
              <Badge
                key={category?.id}
                variant="secondary"
                className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors capitalize"
              >
                {category?.name}
              </Badge>
            ))}
          </div>
        </SkeletonWrapper>
      </CardContent>
    </Card>
  );
};

export default PopularCategories;
