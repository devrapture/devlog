"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { routes } from "@/lib/routes";
import { getInitials } from "@/lib/utils";
import type { User } from "@/types/api";
import Link from "next/link";
import { Button } from "../ui/button";

type Props = {
  user: Partial<User>;
};

const UserCard = ({ user }: Props) => {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.avatar ?? "/placeholder.svg"} />
            <AvatarFallback>
              {getInitials(user?.displayName ?? "")}
            </AvatarFallback>
          </Avatar>
          <Link
            href={routes.userProfile(user?.id as unknown as string)}
            className="hover:text-primary"
          >
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-1 font-medium">
                {user?.displayName ?? user?.email}
              </h3>
              <p className="text-muted-foreground line-clamp-1 text-sm">
                {user?.bio ?? "No bio available"}
              </p>
            </div>
          </Link>
        </div>
        <Button>Unfollow</Button>
      </CardContent>
    </Card>
  );
};

export default UserCard;
