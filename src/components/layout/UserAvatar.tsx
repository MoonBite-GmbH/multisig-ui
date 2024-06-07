import { type AvatarProps } from "@radix-ui/react-avatar";

import { Avatar, AvatarFallback } from "@/components/ui/Avatar";

import { User as UserIcon } from "lucide-react";

interface UserAvatarProps extends AvatarProps {}

export function UserAvatar({ ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      <AvatarFallback>
        <span className="sr-only">Milan</span>
        <UserIcon className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
}
