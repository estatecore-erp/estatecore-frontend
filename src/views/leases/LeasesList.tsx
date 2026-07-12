"use client";

import Link from "next/link";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { statusVariant } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Lease, ApiResponse } from "@/types";
import LeaseDeleteDialog from "./LeaseDeleteDialog";
import LeaseEditDialog from "./LeaseEditDialog";
import LeaseViewDialog from "./LeaseViewDialog";

const LeasesListSection = () => {
  const { isAdmin } = useAuthStore();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [selected, setSelected] = useState<Lease | null>(null);
  const [editing, setEditing] = useState<Lease | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [leaseToDelete, setLeaseToDelete] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchLeases = useCallback(async () => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        search: debouncedSearch,
        status,
      });
      const res = await fetch(`/api/leases?${query.toString()}`);
      const json: ApiResponse<{ data: Lease[]; last_page: number }> =
        await res.json();

      if (json.success && json.data) {
        const leasesData = json.data.data || json.data;
        const lastPage = json.data.last_page || 1;

        setLeases((leasesData as Lease[]) || []);
        setTotalPages(lastPage);
      } else {
        toast.error("Failed to load leases");
      }
    } catch (error) {
      console.error("Failed to fetch leases", error);
      toast.error("Failed to load leases");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status]);

  useEffect(() => {
    const load = async () => {
      await fetchLeases();
    };
    load();
  }, [fetchLeases]);

  if (loading) return <div className="p-4 text-center">Loading leases...</div>;

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

      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
        <Input
          placeholder="Search by client or property"
          className="flex-1 max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <Select
            value={status}
            onValueChange={(val) => {
              setStatus(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-35">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Monthly Rent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leases.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-6"
                >
                  No leases found
                </TableCell>
              </TableRow>
            ) : (
              leases.map((lease) => (
                <TableRow key={lease.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {lease.client.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {lease.property.title}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(lease.start_date)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(lease.end_date)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatCurrency(lease.monthly_rent)}
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
                      onClick={() => setSelected(lease)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {isAdmin() && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditing(lease)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            setLeaseToDelete(lease.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
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

      <LeaseViewDialog
        lease={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />

      <LeaseEditDialog
        lease={editing}
        onOpenChange={(open) => !open && setEditing(null)}
        onSuccess={fetchLeases}
      />

      <LeaseDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        leaseId={leaseToDelete}
        onSuccess={fetchLeases}
      />
    </div>
  );
};

export default LeasesListSection;
