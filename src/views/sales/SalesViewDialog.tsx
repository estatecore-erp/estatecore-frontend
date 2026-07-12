"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Sale } from "@/types";

interface Props {
  sale: Sale | null;
  onOpenChange: (open: boolean) => void;
}

const SaleViewDialog = ({ sale, onOpenChange }: Props) => {
  return (
    <Dialog open={sale !== null} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">View sale dialog</DialogTitle>
      <DialogDescription className="sr-only">
        just for sr only
      </DialogDescription>

      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        {sale && (
          <div className="space-y-5">
            <div>
              <p className="mb-1 text-sm text-muted-foreground">Client</p>
              <p className="font-medium">{sale.client.name}</p>
              <p className="text-sm text-muted-foreground">
                {sale.client.email}
              </p>
            </div>

            <div className="h-px w-full bg-border" />

            <div>
              <p className="mb-1 text-sm text-muted-foreground">Property</p>
              <p className="font-medium">
                {sale.property.title} — {sale.property.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Sale date</p>
                <p className="font-medium">{formatDate(sale.sale_date)}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Sale price</p>
                <p className="font-medium">{formatCurrency(sale.sale_price)}</p>
              </div>
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

export default SaleViewDialog;
