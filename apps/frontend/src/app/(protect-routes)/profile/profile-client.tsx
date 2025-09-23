"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import SkeletonWrapper from "@/components/ui/skeleton-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetUserProfile } from "@/hooks/query/use-user";
import { routes } from "@/lib/routes";
import { formatDate, getInitials } from "@/lib/utils";
import { Calendar, FileText, Users } from "lucide-react";
import Link from "next/link";
import ProfileSkeletonLoader from "../../../components/profile/profile-skeleton-loader";
import FollowersList from "../../../components/profile/followers-list";
import { useQueryState } from "nuqs";

const ProfileClient = () => {
  const [tab, setTab] = useQueryState("tab");
  const { data, isLoading } = useGetUserProfile();
  const profile = data?.user;
  const handleChangeTab = async (e: string) => await setTab(e);
  return (
    <div className="container mx-auto px-4 py-8">
      <SkeletonWrapper isLoading={isLoading} Loader={ProfileSkeletonLoader}>
        <div className="space-y-6">
          <Link
            href={routes.editProfile}
            className="text-primary flex justify-end"
          >
            Edit Profile
          </Link>
          {/* Profile Header */}
          <Card className="mt-10">
            <CardHeader>
              <div className="flex flex-col gap-6 md:flex-row">
                <Avatar className="mx-auto h-24 w-24 md:mx-0">
                  <AvatarImage
                    src={profile?.avatar ?? "/placeholder-user.jpg"}
                  />
                  <AvatarFallback className="text-2xl">
                    {getInitials(profile?.displayName ?? "")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center md:text-left">
                  <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="mb-1 text-2xl font-bold">
                        {profile?.displayName}
                      </h1>
                      <p className="text-muted-foreground">{profile?.email}</p>
                    </div>
                  </div>

                  {profile?.bio && (
                    <p className="text-muted-foreground mb-4">{profile?.bio}</p>
                  )}

                  <div className="text-muted-foreground flex flex-wrap justify-center gap-4 text-sm md:justify-start">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{profile?.followersCount ?? 0} followers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{profile?.followingCount ?? 0} following</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {/* TODO add post count in backend */}
                      {/* @ts-expect-error  error*/}
                      <span>{profile?.postsCount ?? 0} posts</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(profile?.createdAt ?? "")}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center gap-2 md:justify-start">
                    <Badge
                      variant={profile?.isActive ? "default" : "secondary"}
                    >
                      {profile?.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{profile?.role}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Profile Content */}
          <Tabs
            onValueChange={handleChangeTab}
            defaultValue={tab ?? "posts"}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="followers">Followers</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
            </TabsList>
            {/* 
            <TabsContent value="posts" className="mt-6">
            <div className="space-y-4">
              {!postsLoading && posts.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No posts yet</p>
                </div>
              )}

              {postsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="text-primary h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} showAuthor={false} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent> */}

            <TabsContent value="followers" className="mt-6">
              <FollowersList />
            </TabsContent>

            {/* <TabsContent value="following" className="mt-6">
            <FollowingList userId={userId} />
          </TabsContent> */}
          </Tabs>
        </div>
      </SkeletonWrapper>
    </div>
  );
};

export default ProfileClient;
