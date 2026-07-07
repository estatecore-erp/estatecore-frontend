"use client";

import Link from "next/link";
import { Pencil, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { PAGE_SIZE, statusVariant } from "@/lib/constants";

type LeaseStatus = "active" | "expired";

interface Lease {
  id: number;
  property: string;
  client: string;
  dates: string;
  rent: string;
  status: LeaseStatus;
}

const mockLeases: Lease[] = [
  {
    id: 1,
    property: "City Apartment",
    client: "John Client",
    dates: "Jul 1 – Jul 2027",
    rent: "LKR 25,000",
    status: "active",
  },
  {
    id: 2,
    property: "Sea View Flat",
    client: "Sam Client",
    dates: "Jan 1 – Jan 2026",
    rent: "LKR 40,000",
    status: "expired",
  },
];

const LeasesListSection = () => {
  const [page, setPage] = useState(1);
  const [leases, setLeases] = useState<Lease[]>(mockLeases);
  const [editing, setEditing] = useState<Lease | null>(null);
  const [editStatus, setEditStatus] = useState<LeaseStatus>("active");
  const [deleting, setDeleting] = useState<Lease | null>(null);

  const totalPages = Math.ceil(leases.length / PAGE_SIZE);
  const paginatedLeases = leases.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const openEdit = (lease: Lease) => {
    setEditing(lease);
    setEditStatus(lease.status);
  };

  const saveEdit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    setLeases((prev) =>
      prev.map((l) => (l.id === editing.id ? { ...l, status: editStatus } : l)),
    );
    setEditing(null);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    setLeases((prev) => prev.filter((l) => l.id !== deleting.id));
    setDeleting(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Leases</h1>
        <Button asChild>
          <Link href="/dashboard/leases/create">
            <Plus className="w-4 h-4 mr-2" />
            Add lease
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Rent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLeases.map((lease) => (
              <TableRow key={lease.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {lease.property}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {lease.client}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {lease.dates}
                </TableCell>
                <TableCell className="whitespace-nowrap font-medium">
                  {lease.rent}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${statusVariant[lease.status]} w-20 justify-center capitalize`}
                  >
                    {lease.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2 whitespace-nowrap">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(lease)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDeleting(lease)}
                  >
                    <Trash className="w-4 h-4" />
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
        open={editing !== null}
        onOpenChange={(open) => !open && setEditing(null)}
      >
        <DialogTitle className="sr-only">Lease Edit dialog</DialogTitle>
        <DialogDescription className="sr-only">
          Only display in Sr
        </DialogDescription>

        <DialogContent className="sm:max-w-md">
          {editing && (
            <form onSubmit={saveEdit} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {editing.property} · {editing.client}
              </p>

              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={editStatus}
                  onValueChange={(v) => setEditStatus(v as LeaseStatus)}
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
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <DialogTitle className="sr-only">Lease delete dialog</DialogTitle>
        <DialogDescription className="sr-only">
          Only display in Sr
        </DialogDescription>

        <DialogContent className="sm:max-w-md">
          {deleting && (
            <div className="space-y-4">
              <h3 className="font-semibold">Delete lease?</h3>
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

export default LeasesListSection;
