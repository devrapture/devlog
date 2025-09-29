import NoDrafts from "@/app/(protect-routes)/drafts/components/no-draft";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDeletePost, usePublishDraft } from "@/hooks/mutate/use-posts";
import { PostType, useGetMyPosts } from "@/hooks/query/use-posts";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import SkeletonWrapper from "../ui/skeleton-wrapper";
import DraftListSkeleton from "./draft-list-skeleton";
import { formatDate } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { useRouter } from "next/navigation";

const DraftList = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [draftId, setDraftId] = useState<string | null>(null);
  const { data, isLoading } = useGetMyPosts(PostType.DRAFT);
  const drafts = data?.data;
  const handleOpenDialog = (id: string) => setDraftId(id);

  const cb = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["get-my-posts"],
    });
  };

  const { mutate: deleteDraft, isPending: isDeleting } = useDeletePost(cb);
  const { mutateAsync: publishDraft, isPending: isPublishing } =
    usePublishDraft(cb);

  const handleDelete = async () => {
    deleteDraft({ id: draftId! });
  };

  const handlePublish = async () => {
    const res = await publishDraft({ id: draftId! });
    router.replace(routes.postBySlug(String(res?.data?.slug)));
  };

  return (
    <SkeletonWrapper
      isEmpty={!drafts?.items?.length}
      EmptyComponent={<NoDrafts />}
      isLoading={isLoading}
      Loader={DraftListSkeleton}
    >
      <div className="space-y-4">
        {drafts?.items?.map((draft) => (
          <Card key={draft.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="mb-2 text-lg">
                    {draft.title || "Untitled Draft"}
                  </CardTitle>
                  <div className="mb-2 flex flex-wrap gap-2">
                    {draft.categories.map((category) => (
                      <Badge
                        key={category.id}
                        variant="secondary"
                        className="text-xs capitalize"
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Last updated: {formatDate(draft.updatedAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={routes.editor(draft.id)}>
                    <Button size="sm" variant="outline">
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog onOpenChange={() => handleOpenDialog(draft.id)}>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" className="cursor-pointer">
                        Publish
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will publish your draft as a post and make it
                          publicly visible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <Button
                          size="sm"
                          className="cursor-pointer"
                          onClick={handlePublish}
                        >
                          {isPublishing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Publish"
                          )}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog onOpenChange={() => handleOpenDialog(draft.id)}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <Button
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer"
                          onClick={handleDelete}
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Continue"
                          )}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            {draft.body && (
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {draft.body.replace(/<[^>]*>/g, "").substring(0, 200)}...
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </SkeletonWrapper>
  );
};

export default DraftList;
