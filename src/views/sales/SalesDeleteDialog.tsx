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
  saleId: number | null;
  onSuccess: () => void;
}

const SalesDeleteDialog = ({
  isOpen,
  onOpenChange,
  saleId,
  onSuccess,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!saleId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/sales/${saleId}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok || json.success === false) {
        toast.error(json.message || "Failed to delete sale");
        return;
      }

      toast.success("Sale deleted successfully");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to delete sale", error);
      toast.error("Failed to delete sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete sale</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the sale and revert the property to
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

export default SalesDeleteDialog;
