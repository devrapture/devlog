import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  postId: string;
  initialLikes: number;
  className?: string;
  showCount?: boolean;
};

const LikeButton = ({
  postId,
  initialLikes,
  className,
  showCount = true,
}: Props) => {
  return (
    <Button
      variant="ghost"
      size="sm"
    // onClick={handleLikeToggle}
    // disabled={loading}
    // className={cn(
    //   "flex items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors",
    //   isLiked && "text-red-500",
    //   className,
    // )}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all",
          // isLiked && "fill-current"
        )}
      />
      {/* {showCount && <span>{likesCount}</span>} */}
    </Button>
  );
};

export default LikeButton;
