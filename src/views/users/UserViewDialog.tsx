"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/formatters";
import { useAuthStore } from "@/store/auth";
import { User } from "@/types";

interface Props {
  user: User | null;
  onOpenChange: (open: boolean) => void;
}

const UserViewDialog = ({ user, onOpenChange }: Props) => {
  const { isAdmin } = useAuthStore();

  return (
    <Dialog open={user !== null} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">View user dialog</DialogTitle>
      <DialogDescription className="sr-only">
        just for sr only
      </DialogDescription>

      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        {user && (
          <div className="space-y-5">
            <div>
              <p className="mb-1 text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <div className="h-px w-full bg-border" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{user.phone || "N/A"}</p>
              </div>
            </div>

            {user.role === "client" && (
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{user.address || "N/A"}</p>
              </div>
            )}

            {user.role === "agent" && (
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Hire date</p>
                <p className="font-medium">
                  {user.hire_date ? formatDate(user.hire_date) : "N/A"}
                </p>
              </div>
            )}

            <div>
              <p className="mb-1 text-sm text-muted-foreground">Joined</p>
              <p className="font-medium">{formatDate(user.created_at)}</p>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              {isAdmin() && (
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/users/${user.id}/edit`}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                </Button>
              )}
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserViewDialog;
