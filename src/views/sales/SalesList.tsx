"use client";

import Link from "next/link";
import { Eye, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
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
import { Sale, ApiResponse } from "@/types";
import SalesDeleteDialog from "./SalesDeleteDialog";
import SaleViewDialog from "./SalesViewDialog";

const SalesListSection = () => {
  const { isAdmin } = useAuthStore();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [selected, setSelected] = useState<Sale | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchSales = useCallback(async () => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        search: debouncedSearch,
      });
      const res = await fetch(`/api/sales?${query.toString()}`);
      const json: ApiResponse<{ data: Sale[]; last_page: number }> =
        await res.json();

      if (json.success && json.data) {
        const salesData = json.data.data || json.data;
        const lastPage = json.data.last_page || 1;

        setSales((salesData as Sale[]) || []);
        setTotalPages(lastPage);
      } else {
        toast.error("Failed to load sales");
      }
    } catch (error) {
      console.error("Failed to fetch sales", error);
      toast.error("Failed to load sales");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    const load = async () => {
      await fetchSales();
    };
    load();
  }, [fetchSales]);

  if (loading) return <div className="p-4 text-center">Loading sales...</div>;

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

      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
        <Input
          placeholder="Search by client or property"
          className="flex-1 max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Sale date</TableHead>
              <TableHead>Sale price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground py-6"
                >
                  No sales found
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {sale.client?.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {sale.property?.title}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(sale.sale_date)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatCurrency(sale.sale_price)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${statusVariant[sale.property?.status] ?? ""} w-24 justify-center capitalize`}
                    >
                      {sale.property?.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelected(sale)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {isAdmin() && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setSaleToDelete(sale.id);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
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

      <SaleViewDialog
        sale={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />

      <SalesDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        saleId={saleToDelete}
        onSuccess={fetchSales}
      />
    </div>
  );
};

export default SalesListSection;
