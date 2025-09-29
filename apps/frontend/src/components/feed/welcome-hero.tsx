"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCreateDraft } from "@/hooks/mutate/use-posts";
import { routes } from "@/lib/routes";
// import { useAuth } from "@/hooks/use-auth"
import { BookOpen, Loader2, PenTool, Users, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export function WelcomeHero() {
  const router = useRouter();
  const { mutateAsync: createDraft, isPending: isCreatingDraft } =
    useCreateDraft();
  const handleCreateDraft = async () => {
    const res = await createDraft();
    router.push(routes.editor(res?.data?.draft?.id ?? ""));
  };

  return (
    <div className="mb-12 text-center">
      <h1 className="mb-6 text-4xl font-bold text-balance md:text-6xl">
        Share Your Developer Journey
      </h1>
      <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl text-balance">
        Join thousands of developers sharing knowledge, experiences, and
        insights. Build your audience, connect with peers, and grow your career.
      </p>

      <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
        <Button
          onClick={handleCreateDraft}
          disabled={isCreatingDraft}
          size="lg"
          className="flex items-center gap-2 cursor-pointer"
        >
          {isCreatingDraft ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PenTool className="h-5 w-5" />
          )}
          Start Writing
        </Button>
        <Button variant="outline" size="lg" asChild>
          <a href="#explore" className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Explore Posts
          </a>
        </Button>
      </div>

      {/* Feature highlights */}
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
        <Card className="p-6 text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
            <PenTool className="text-primary h-6 w-6" />
          </div>
          <h3 className="mb-2 font-semibold">Rich Editor</h3>
          <p className="text-muted-foreground text-sm">
            Write with our powerful editor supporting markdown, code blocks, and
            media
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="bg-secondary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
            <Users className="text-secondary h-6 w-6" />
          </div>
          <h3 className="mb-2 font-semibold">Community</h3>
          <p className="text-muted-foreground text-sm">
            Connect with fellow developers, follow your favorites, and build
            your network
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="bg-accent/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
            <Zap className="text-accent h-6 w-6" />
          </div>
          <h3 className="mb-2 font-semibold">Engagement</h3>
          <p className="text-muted-foreground text-sm">
            Like, bookmark, and share posts. Track your analytics and grow your
            audience
          </p>
        </Card>
      </div>
    </div>
  );
}
