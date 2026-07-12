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
  inquiryId: number | null;
  onSuccess: () => void;
}

const InquiryDeleteDialog = ({
  isOpen,
  onOpenChange,
  inquiryId,
  onSuccess,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!inquiryId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok || json.success === false) {
        toast.error(json.message || "Failed to delete inquiry");
        return;
      }

      toast.success("Inquiry deleted successfully");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to delete inquiry", error);
      toast.error("Failed to delete inquiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete inquiry</AlertDialogTitle>
          <AlertDialogDescription>
            This action can&apos;t be undone. This will permanently delete the
            inquiry.
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

export default InquiryDeleteDialog;
