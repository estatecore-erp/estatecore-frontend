"use client";

import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { PAGE_SIZE } from "@/lib/constants";

interface Sale {
  id: number;
  property: string;
  client: string;
  price: string;
  date: string;
}

const mockSales: Sale[] = [
  {
    id: 1,
    property: "Luxury Villa",
    client: "John Client",
    price: "LKR 490,000",
    date: "Jun 29, 2026",
  },
  {
    id: 2,
    property: "Hillside Bungalow",
    client: "Ama Perera",
    price: "LKR 315,000",
    date: "Jun 12, 2026",
  },
];

const SalesListSection = () => {
  const [page, setPage] = useState(1);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [deleting, setDeleting] = useState<Sale | null>(null);

  const totalPages = Math.ceil(sales.length / PAGE_SIZE);
  const paginatedSales = sales.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const confirmDelete = () => {
    if (!deleting) return;
    // TODO: connect to API later — DELETE /sales/{id}, reverts property to available
    setSales((prev) => prev.filter((s) => s.id !== deleting.id));
    setDeleting(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Sales</h1>
        <Button asChild>
          <Link href="/dashboard/sales/create">
            <Plus className="w-4 h-4 mr-2" />
            Add sale
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Sale price</TableHead>
              <TableHead>Sale date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {sale.property}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {sale.client}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {sale.price}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {sale.date}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleting(sale)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
                aria-disabled={page === 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <PaginationItem key={n}>
                <PaginationLink
                  href="#"
                  isActive={n === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(n);
                  }}
                >
                  {n}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(totalPages, p + 1));
                }}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
                aria-disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <DialogTitle className="sr-only">Sales delete dialog</DialogTitle>
        <DialogDescription className="sr-only">
          only for SR only
        </DialogDescription>

        <DialogContent className="sm:max-w-md">
          {deleting && (
            <div className="space-y-4">
              <h3 className="font-semibold">Delete sale?</h3>
              <p className="text-sm text-muted-foreground">
                {deleting.property} — {deleting.client}. Property reverts to
                available. This can&apos;t be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleting(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDelete}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SalesListSection;
