"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUploadFile } from "@/hooks/mutate/use-file-upload";
import { useUpdateUserProfile } from "@/hooks/mutate/use-user";
import { useGetUserProfile } from "@/hooks/query/use-user";
import { getInitials } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRef, useState, type FormEvent } from "react";

const EditPageClient = () => {
  const { update } = useSession();
  const { data, isLoading } = useGetUserProfile();
  const user = data?.user;
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isPending: isUpdating, mutate: updateUserProfile } =
    useUpdateUserProfile(update);
  const { mutate: uploadFile } = useUploadFile();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      displayName,
      bio,
      avatar,
    });
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      triggerFilePicker();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      uploadFile(
        { file, altText: `Profile picture for ${displayName || user?.email}` },
        {
          onSuccess: (uploadedFile) => {
            setAvatar(uploadedFile.url);
            setIsUploading(false);
          },
          onError: () => {
            setIsUploading(false);
          },
        },
      );
    } catch {
      setIsUploading(false);
    }
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
                className="group relative h-20 w-20 cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label="Change avatar"
                onClick={triggerFilePicker}
                onKeyDown={handleAvatarKey}
              >
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatar || "/placeholder-user.jpg"} />
                  <AvatarFallback className="text-lg">
                    {getInitials(displayName ?? user?.displayName)}
                  </AvatarFallback>
                </Avatar>

                {/* Subtle overlay on hover or while uploading */}
                <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-black/5 transition group-hover:bg-black/10" />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <p className="text-muted-foreground text-xs">
                  Click the avatar to upload an image. Max size: 5MB
                </p>
              </div>
            </div>

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
