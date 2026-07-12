"use client";

import { useRouter } from "next/navigation";
import UserProfileCard from "@/components/user/UserProfileCard";
import { useSidebar } from "@/components/ui/sidebar";

const SidebarUserCard = ({ onNavigate }: { onNavigate?: () => void }) => {
  const router = useRouter();
  const { open } = useSidebar();

  return (
    <UserProfileCard
      collapsed={!open}
      onClick={() => {
        onNavigate?.();
        router.push("/dashboard/profile");
      }}
    />
  );
};

export default SidebarUserCard;
