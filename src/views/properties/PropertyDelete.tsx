"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

interface PropertyDeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: number | null;
  onSuccess: () => void;
}

const PropertyDeleteDialog = ({
  isOpen,
  onOpenChange,
  propertyId,
  onSuccess,
}: PropertyDeleteDialogProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!propertyId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Property deleted successfully");
        onSuccess();
      } else {
        toast.error("Failed to delete property");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting the property");
    } finally {
      setLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Property</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this property? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDeleteDialog;
