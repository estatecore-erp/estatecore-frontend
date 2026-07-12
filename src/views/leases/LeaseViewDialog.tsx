"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Lease } from "@/types";

interface Props {
  lease: Lease | null;
  onOpenChange: (open: boolean) => void;
}

const LeaseViewDialog = ({ lease, onOpenChange }: Props) => {
  return (
    <Dialog open={lease !== null} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">View lease dialog</DialogTitle>
      <DialogDescription className="sr-only">
        just for sr only
      </DialogDescription>

      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        {lease && (
          <div className="space-y-5">
            <div>
              <p className="mb-1 text-sm text-muted-foreground">Client</p>
              <p className="font-medium">{lease.client.name}</p>
              <p className="text-sm text-muted-foreground">
                {lease.client.email}
              </p>
            </div>

            <div className="h-px w-full bg-border" />

            <div>
              <p className="mb-1 text-sm text-muted-foreground">Property</p>
              <p className="font-medium">
                {lease.property.title} — {lease.property.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Start date</p>
                <p className="font-medium">{formatDate(lease.start_date)}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">End date</p>
                <p className="font-medium">{formatDate(lease.end_date)}</p>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm text-muted-foreground">Monthly rent</p>
              <p className="font-medium">
                {formatCurrency(lease.monthly_rent)}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-1">
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

export default LeaseViewDialog;
