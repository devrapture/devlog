"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateUserProfile } from "@/hooks/mutate/use-user";
import { useGetUserProfile } from "@/hooks/query/use-user";
import { getInitials } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

const EditPageClient = () => {
  const { data, isLoading } = useGetUserProfile();
  const user = data?.user;
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const { isPending: isUpdating, mutate: updateUserProfile } =
    useUpdateUserProfile();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      displayName,
      bio,
      avatar,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Preview */}
            <div className="flex items-center gap-4">
              <div
                className="relative h-20 w-20 cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="Change avatar"
                // onClick={triggerFilePicker}
                // onKeyDown={handleAvatarKey}
              >
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatar || "/placeholder-user.jpg"} />
                  <AvatarFallback className="text-lg">
                    {getInitials(displayName ?? user?.displayName)}
                  </AvatarFallback>
                </Avatar>

                {/* Subtle overlay on hover or while uploading */}
                {/* <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-black/5 transition group-hover:bg-black/10" />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )} */}
              </div>

              <div className="flex-1 space-y-2">
                {/* Hidden file input */}
                <input
                  //   ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  //   onChange={handleFileChange}
                />

                <p className="text-muted-foreground text-xs">
                  Click the avatar to upload an image.
                </p>
              </div>
            </div>
            {/* <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatar || "/placeholder-user.jpg"} />
                <AvatarFallback className="text-lg">
                  {getInitials(displayName ?? user?.displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </div>
            </div> */}

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="Your display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
              />
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email}
                disabled
                className="bg-muted"
              />
              <p className="text-muted-foreground text-xs">
                Email cannot be changed
              </p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPageClient;
