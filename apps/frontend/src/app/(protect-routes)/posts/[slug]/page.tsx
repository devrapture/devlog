"use client";

import SocialActions from "@/components/socials/social-actions";
import DOMPurify from "isomorphic-dompurify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRevertToDraft } from "@/hooks/mutate/use-posts";
import { useGetPostBySlug } from "@/hooks/query/use-posts";
import { routes } from "@/lib/routes";
import { formatDate, getAuthorInitials, getReadingTime } from "@/lib/utils";
import { Calendar, Clock, Eye, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import pluralize from "pluralize";

const BlogPostPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { mutateAsync: revertToDraftMutation, isPending: isRevertingToDraft } =
    useRevertToDraft();
  const { data, isLoading, isError } = useGetPostBySlug({
    variables: { slug: String(slug) },
    enabled: !!slug,
  });
  const post = data?.post;

  const handleRevertToDraft = async () => {
    const res = await revertToDraftMutation({
      postId: data?.post?.id ?? "",
    });
    router.replace(routes.editor(res?.data?.id));
  };

  const rawHtml = (post?.body ?? "")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /`(.*?)`/g,
      '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>',
    )
    .replace(/\n/g, "<br>");
  const safeHtml = DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isLoading && isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Post Not Found</h1>
        <p className="text-muted-foreground">
          The post you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
      </div>
    );
  }
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {post?.author?.id === session?.user?.id && (
        <div className="mb-8 flex justify-end">
          <Button disabled={isRevertingToDraft} onClick={handleRevertToDraft}>
            {isRevertingToDraft ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Revert to draft
          </Button>
        </div>
      )}
      <article>
        {/* Header */}
        <header className="mb-8">
          {post?.coverImage && (
            <div className="mb-6 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={post?.coverImage || "/placeholder.svg"}
                alt={post?.title}
                width={1280}
                height={720}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="mb-4 flex flex-wrap gap-2">
            {post?.categories?.map((category) => (
              <Badge
                key={category?.id}
                variant="secondary"
                className="capitalize"
              >
                {category?.name}
              </Badge>
            ))}
          </div>

          <h1 className="mb-6 text-4xl font-bold text-balance">
            {post?.title}
          </h1>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <Link href={routes.userProfile(post?.author?.id ?? "#")}>
              <div className="flex items-center gap-3 transition-opacity hover:opacity-80">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={post?.author?.avatar ?? "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {getAuthorInitials(post?.author?.displayName ?? "")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{post?.author?.displayName}</p>
                  <div className="text-muted-foreground flex items-center gap-4 text-sm">
                    {post?.publishedAt && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post?.publishedAt)}
                      </div>
                    )}
                    {post?.body && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getReadingTime(post?.body)}
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {pluralize("view", post?.views ?? 0, true)}
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <SocialActions post={post} size="lg" />
          </div>
        </header>

        {/* Content */}
        <Card>
          <CardContent className="p-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="mt-8 border-t pt-8">
          <SocialActions post={post} size="lg" className="justify-center" />
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
