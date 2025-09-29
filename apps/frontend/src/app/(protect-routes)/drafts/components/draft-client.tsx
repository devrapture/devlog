"use client";

import DraftList from "@/components/posts/draft-list";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/logic/use-toast";
import { useCreateDraft } from "@/hooks/mutate/use-posts";
import { routes } from "@/lib/routes";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const DraftClient = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { mutateAsync: createDraft, isPending: isCreatingDraft } =
    useCreateDraft();

  const handleCreateDraft = async () => {
    const res = await createDraft();
    const id = res?.data?.draft?.id;
    if (!id) {
      toast({
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return;
    }
    router.push(routes.editor(id));
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
