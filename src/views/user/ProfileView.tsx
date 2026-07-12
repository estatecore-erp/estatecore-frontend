"use client";

import { useEffect, useState } from "react";
import UserAvatar from "@/components/user/UserAvatar";
import LogoutButton from "@/components/auth/LogoutButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types";

const ProfileView = () => {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((json) => setData(json.user))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 space-y-4">
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-center mt-10 text-muted-foreground">
        Failed to load profile.
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <UserAvatar name={data.name} className="h-14 w-14 text-lg" />
          <div>
            <h2 className="text-lg font-semibold">{data.name}</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted capitalize">
              {data.role}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm">{data.email}</p>
          </div>
          {data.phone && (
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm">{data.phone}</p>
            </div>
          )}
          <div className="pt-4">
            <LogoutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileView;
