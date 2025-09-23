"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import { Button } from "../ui/button";
import type { User } from "@/types/api";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.avatar ?? "/placeholder.svg"} />
            <AvatarFallback>{getInitials(user?.displayName ?? "")}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium">{user?.displayName}</h3>
            <p className="text-muted-foreground truncate text-sm">
              {user?.bio ?? "No bio available"}
            </p>
          </div>
        </div>
        <Button>Unfollow</Button>
      </CardContent>
    </Card>
  );
};

export default UserCard;
