import { routes } from "@/lib/routes";
import { formatDate, getAuthorInitials } from "@/lib/utils";
import type { Post } from "@/types/api";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";

type Props = {
    post: Post;
    showAuthor?: boolean;
};

const PostCard = ({ post, showAuthor }: Props) => {

    return (
        <Card className="group transition-shadow duration-200 hover:shadow-lg">
            <CardHeader className="pb-3">
                {post?.coverImage && (
                    <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg">
                        <Image
                            src={post.coverImage || "/placeholder.svg"}
                            alt={post.title}
                            width={1280}
                            height={720}
                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                    </div>
                )}

                <div className="mb-3 flex flex-wrap gap-2">
                    {post?.categories?.map((category) => (
                        <Badge
                            key={category.id}
                            variant="secondary"
                            className="text-xs capitalize"
                        >
                            {category.name}
                        </Badge>
                    ))}
                </div>

                <Link href={routes.postBySlug(post.slug ?? "#")}>
                    <h3 className="hover:text-primary line-clamp-2 cursor-pointer text-xl font-bold text-balance transition-colors">
                        {post.title}
                    </h3>
                </Link>

                {showAuthor && (
                    <div className="mt-3 flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={post?.author?.avatar ?? "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                                {getAuthorInitials(post?.author?.displayName ?? "")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <p className="text-foreground truncate text-sm font-medium">
                                {post?.author?.displayName}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                {formatDate(post?.publishedAt ?? post?.createdAt)}
                            </p>
                        </div>
                    </div>
                )}
            </CardHeader>

            <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                    {post.body.replace(/<[^>]*>/g, "").substring(0, 150)}...
                </p>

                {/* <SocialActions post={post} /> */}
            </CardContent>
        </Card>
    );
};

export default PostCard;
