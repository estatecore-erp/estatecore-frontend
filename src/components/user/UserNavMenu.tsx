"use client";

import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/user/UserAvatar";
import { useAuthStore } from "@/store/auth";

const UserNavMenu = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    router.push("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 outline-none">
        <UserAvatar name={user?.name} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2 py-2">
          <UserAvatar name={user?.name} />
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/portal/profile")}>
          <User className="w-4 h-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNavMenu;
