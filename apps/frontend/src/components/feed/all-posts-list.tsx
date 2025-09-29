import { useGetAllPosts } from "@/hooks/query/use-posts";
import { Loader2 } from "lucide-react";
import PostCard from "../posts/post-card";

const AllPostsList = () => {
  const { data, isLoading } = useGetAllPosts();
  const posts = data?.data?.items;
  return (
    <div className="space-y-4">
      {!isLoading && posts?.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No posts yet</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts?.map((post) => (
            <PostCard key={post?.id} post={post} showAuthor={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPostsList;
