"use client";

import DraftList from "@/components/posts/draft-list";
import { Button } from "@/components/ui/button";
import { useCreateDraft } from "@/hooks/mutate/use-posts";
import { routes } from "@/lib/routes";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const DraftClient = () => {
  const router = useRouter();
  const { mutateAsync: createDraft, isPending: isCreatingDraft } =
    useCreateDraft();

  const handleCreateDraft = async () => {
    const res = await createDraft();
    router.push(routes.editor(res?.data?.draft?.id ?? ""));
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">My Drafts</h1>
          <p className="text-muted-foreground mt-2">
            Manage your unpublished posts and drafts
          </p>
        </div>
        <Button onClick={handleCreateDraft} disabled={isCreatingDraft}>
          {isCreatingDraft ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          New Draft
        </Button>
      </div>

      <DraftList />
    </div>
  );
};

export default DraftClient;
