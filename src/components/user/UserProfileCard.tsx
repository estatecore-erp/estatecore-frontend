"use client";

import { ArrowRight } from "lucide-react";
import UserAvatar from "@/components/user/UserAvatar";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

const UserProfileCard = ({
  onClick,
  collapsed = false,
}: {
  onClick: () => void;
  collapsed?: boolean;
}) => {
  const { user } = useAuthStore();

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center rounded-lg border p-2 hover:bg-accent transition-colors w-full",
        collapsed ? "justify-center" : "justify-between gap-2",
      )}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <UserAvatar name={user?.name} />
        {!collapsed && (
          <div className="flex flex-col items-start overflow-hidden">
            <span className="text-sm font-medium truncate">{user?.name}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </span>
          </div>
        )}
      </div>
      {!collapsed && (
        <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground" />
      )}
    </button>
  );
};

export default UserProfileCard;
