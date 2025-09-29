"use client";

import PopularCategories from "@/components/category/popular-categories";
import FeedTabs from "@/components/feed/feed-tabs";
import { WelcomeHero } from "@/components/feed/welcome-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/logic/use-toast";
import { useCreateDraft } from "@/hooks/mutate/use-posts";
import { routes } from "@/lib/routes";
import { BookOpen, Calendar, Loader2, TrendingUp, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function HomePage() {
  const { status } = useSession();
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

  const isAuthenticated = status === "authenticated";

  return (
    <div className="container mx-auto px-4 py-8">
      <WelcomeHero />

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Main Content */}
        <Suspense fallback={<div>loading...</div>}>
          <div className="lg:col-span-3" id="explore">
            <FeedTabs />
          </div>
        </Suspense>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          {isAuthenticated && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  disabled={isCreatingDraft}
                  onClick={handleCreateDraft}
                  className="w-full cursor-pointer"
                >
                  {isCreatingDraft ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Write New Post
                </Button>
                <Link href="/drafts">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer bg-transparent"
                  >
                    View Drafts
                  </Button>
                </Link>
                <Link href="/bookmarks">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer bg-transparent"
                  >
                    My Bookmarks
                  </Button>
                </Link>
                <Link href={routes.profile}>
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer bg-transparent"
                  >
                    My Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Popular Categories */}
          <PopularCategories />

          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    Active Writers
                  </span>
                </div>
                <span className="font-semibold">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    Posts Published
                  </span>
                </div>
                <span className="font-semibold">5,678</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground text-sm">
                    This Week
                  </span>
                </div>
                <span className="font-semibold">89</span>
              </div>
            </CardContent>
          </Card>

          {/* Welcome Message for New Users */}
          {!isAuthenticated && (
            <Card className="from-primary/10 to-secondary/10 border-primary/20 bg-gradient-to-br">
              <CardHeader>
                <CardTitle className="text-primary">
                  Join DevLog Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  Start your developer blogging journey. Share your knowledge,
                  connect with the community, and grow your audience.
                </p>
                <Link href={routes.auth.signUp}>
                  <Button className="w-full">Sign Up Free</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
