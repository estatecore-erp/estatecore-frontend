"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  leaseId: number | null;
  onSuccess: () => void;
}

const LeaseDeleteDialog = ({
  isOpen,
  onOpenChange,
  leaseId,
  onSuccess,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!leaseId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/leases/${leaseId}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok || json.success === false) {
        toast.error(json.message || "Failed to delete lease");
        return;
      }

      toast.success("Lease deleted successfully");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to delete lease", error);
      toast.error("Failed to delete lease");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete lease</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the lease and revert the property to
            available. This action can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LeaseDeleteDialog;
