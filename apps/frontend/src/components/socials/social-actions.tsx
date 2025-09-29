"use client";
import type { Post } from "@/types/api";

import { Button } from "@/components/ui/button";
import { Eye, MessageCircle, Share2 } from "lucide-react";
import { useToast } from "@/hooks/logic/use-toast";

type Props = {
  post?: Post;
  className?: string;
  size?: "sm" | "md" | "lg";
};
const SocialActions = ({ post, className, size = "sm" }: Props) => {
  const { toast } = useToast();
  const handleShare = async () => {
    const slug = post?.slug;
    if (!slug) {
      toast({
        description: "Post link not available",
        variant: "destructive",
      });
      return;
    }
    const url = `${window.location.origin}/posts/${slug}`;
    const text =
      (post?.body ? post.body.replace(/<[^>]*>/g, "").slice(0, 100) : "") +
      "...";
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text,
          url,
        });
      } catch (error: unknown) {
        // @ts-expect-error - unknown error
        if (error?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast({
        description: "Link copied to clipboard",
      });
    } catch {
      toast({
        description: "Sorry, your browser doesn't support copying.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* <LikeButton postId={post.id} initialLikes={post?.likes} showCount={size !== "sm"} /> */}

      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground flex items-center gap-1 transition-colors hover:bg-transparent hover:text-blue-500"
      >
        <MessageCircle className="h-4 w-4" />
        {size !== "sm" && <span>{post?.comments}</span>}
      </Button>

      {/* <BookmarkButton postId={post.id} initialBookmarks={post?.bookmarks} showCount={size !== "sm"} /> */}

      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        className="text-muted-foreground flex items-center gap-1 transition-colors hover:bg-transparent hover:text-green-500"
      >
        <Share2 className="h-4 w-4" />
      </Button>

      {size !== "sm" && (
        <div className="text-muted-foreground ml-auto flex items-center gap-1 text-sm">
          <Eye className="h-4 w-4" />
          <span>{post?.views}</span>
        </div>
      )}
    </div>
  );
};

export default SocialActions;
