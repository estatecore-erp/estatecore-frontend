"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Lease, LeaseStatus } from "@/types";

interface Props {
  lease: Lease | null;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const LeaseEditDialog = ({ lease, onOpenChange, onSuccess }: Props) => {
  const [status, setStatus] = useState<LeaseStatus>("active");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const updateStatus = () => {
      if (lease) {
        setStatus(lease.status);
      }
    };
    updateStatus();
  }, [lease]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!lease) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/leases/${lease.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();

      if (!res.ok || json.success === false) {
        toast.error(json.message || "Failed to update lease");
        return;
      }

      toast.success("Lease updated successfully");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to update lease", error);
      toast.error("Failed to update lease");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={lease !== null}
      onOpenChange={(open) => !open && onOpenChange(false)}
    >
      <DialogTitle className="sr-only">Lease edit dialog</DialogTitle>
      <DialogDescription className="sr-only">
        just for sr only
      </DialogDescription>

      <DialogContent className="sm:max-w-md">
        {lease && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {lease.property.title} · {lease.client.name}
            </p>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as LeaseStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Marking expired reverts the property to available.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeaseEditDialog;
