"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";

const LogoutButton = () => {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      logout();
      router.push("/login");
    } catch {
      console.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} disabled={loading}>
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
};

export default LogoutButton;
