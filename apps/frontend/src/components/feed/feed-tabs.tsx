import { Globe, Sparkles, TrendingUp, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQueryState } from "nuqs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AllPostsList from "./all-posts-list";

const FeedTabs = () => {
    const [tab, setTab] = useQueryState("tab");
    const { status } = useSession();
    const isAuthenticated = status === "authenticated";
    const handleChangeTab = async (e: string) => await setTab(e);

    return (
        <Tabs
            onValueChange={handleChangeTab}
            defaultValue={tab ?? "all"}
            className="w-full"
        >
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    All Posts
                </TabsTrigger>
                {isAuthenticated && (
                    <TabsTrigger value="following" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Following
                    </TabsTrigger>
                )}
                <TabsTrigger value="trending" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trending
                </TabsTrigger>
                <TabsTrigger value="recent" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Recent
                </TabsTrigger>
            </TabsList>

            {isAuthenticated && (
                <TabsContent value="following" className="mt-6">
                    <div className="mb-6">
                        <h2 className="mb-2 text-xl font-semibold">Your Feed</h2>
                        <p className="text-muted-foreground text-sm">
                            Latest posts from people you follow
                        </p>
                    </div>
                    {/* <PostList type="feed" /> */}
                </TabsContent>
            )}

            <TabsContent value="all" className="mt-6">
                <div className="mb-6">
                    <h2 className="mb-2 text-xl font-semibold">All Posts</h2>
                    <p className="text-muted-foreground text-sm">
                        Discover posts from the entire community
                    </p>
                </div>
                <AllPostsList />
            </TabsContent>

            <TabsContent value="trending" className="mt-6">
                <div className="mb-6">
                    <h2 className="mb-2 text-xl font-semibold">Trending</h2>
                    <p className="text-muted-foreground text-sm">
                        Most popular posts this week
                    </p>
                </div>
                {/* <TrendingPostsList /> */}
            </TabsContent>

            <TabsContent value="recent" className="mt-6">
                <div className="mb-6">
                    <h2 className="mb-2 text-xl font-semibold">Recent</h2>
                    <p className="text-muted-foreground text-sm">
                        Latest posts from the community
                    </p>
                </div>
                {/* <RecentPostsList /> */}
            </TabsContent>
        </Tabs>
    );
};

export default FeedTabs;
