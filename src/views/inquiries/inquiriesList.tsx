"use client";

import { Eye, Phone, Trash } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Inquiry, ApiResponse } from "@/types";
import InquiryDeleteDialog from "./InquiryDeleteDialog";

function truncate(text: string, max = 30) {
  return text.length > max ? `${text.slice(0, max).trimEnd()}...` : text;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const InquiriesListSection = () => {
  const { isAdmin } = useAuthStore();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [updating, setUpdating] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchInquiries = useCallback(async () => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        search: debouncedSearch,
        status,
      });
      const res = await fetch(`/api/inquiries?${query.toString()}`);
      const json: ApiResponse<{ data: Inquiry[]; last_page: number }> =
        await res.json();

      if (json.success && json.data) {
        const inquiriesData = json.data.data || json.data;
        const lastPage = json.data.last_page || 1;

        setInquiries((inquiriesData as Inquiry[]) || []);
        setTotalPages(lastPage);
      } else {
        toast.error("Failed to load inquiries");
      }
    } catch (error) {
      console.error("Failed to fetch inquiries", error);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, status]);

  useEffect(() => {
    const load = async () => {
      await fetchInquiries();
    };
    load();
  }, [fetchInquiries]);

  const markResponded = async (id: number) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "responded" }),
      });
      const json: ApiResponse<Inquiry> = await res.json();

      if (!res.ok || json.success === false) {
        toast.error(json.message || "Failed to update inquiry");
        return;
      }

      toast.success("Inquiry marked as responded");

      setInquiries((prev) =>
        prev.map((inq) =>
          inq.id === id ? { ...inq, status: "responded" as const } : inq,
        ),
      );
      setSelected((prev) =>
        prev && prev.id === id ? { ...prev, status: "responded" } : prev,
      );
    } catch (error) {
      console.error("Failed to update inquiry", error);
      toast.error("Failed to update inquiry");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <div className="p-4 text-center">Loading inquiries...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Inquiries</h1>
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
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
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-6"
                >
                  No inquiries found
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {inquiry.client.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {inquiry.property.title}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {truncate(inquiry.message)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${statusVariant[inquiry.status]} w-24 justify-center capitalize`}
                    >
                      {inquiry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelected(inquiry)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {isAdmin() && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setInquiryToDelete(inquiry.id);
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

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogTitle className="sr-only">View inquiry dialog</DialogTitle>
        <DialogDescription className="sr-only">
          just for sr only
        </DialogDescription>

        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          {selected && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-green-100 font-semibold text-green-800">
                    {initials(selected.client.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{selected.client.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selected.client.email}
                  </p>
                </div>
                {selected.client.phone && (
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={`tel:${selected.client.phone}`}
                      aria-label="Call client"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>

              <div className="h-px w-full bg-border" />

              <div>
                <p className="mb-1 text-sm text-muted-foreground">Property</p>
                <p className="font-medium">
                  {selected.property.title} — {selected.property.location}
                </p>
              </div>

              <div>
                <p className="mb-1 text-sm text-muted-foreground">Message</p>
                <p className="font-medium">{selected.message}</p>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => markResponded(selected.id)}
                  disabled={updating || selected.status === "responded"}
                >
                  {selected.status === "responded"
                    ? "Responded"
                    : "Mark responded"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <InquiryDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        inquiryId={inquiryToDelete}
        onSuccess={fetchInquiries}
      />
    </div>
  );
};

export default InquiriesListSection;
