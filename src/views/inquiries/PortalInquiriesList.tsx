"use client";

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
import { statusVariant } from "@/lib/constants";
import { Inquiry, ApiResponse } from "@/types";

function truncate(text: string, max = 50) {
  return text.length > max ? `${text.slice(0, max).trimEnd()}...` : text;
}

const PortalInquiriesListSection = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page: page.toString(), status });
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
  }, [page, status]);

  useEffect(() => {
    const load = async () => {
      await fetchInquiries();
    };
    load();
  }, [fetchInquiries]);

  if (loading)
    return <div className="p-4 text-center">Loading inquiries...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">My Inquiries</h1>
      </div>

      <div className="flex justify-end">
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

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-6"
                >
                  No inquiries found
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {inquiry.property.title} — {inquiry.property.location}
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
                  <TableCell className="whitespace-nowrap">
                    {new Date(inquiry.created_at).toLocaleDateString()}
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
    </div>
  );
};

export default PortalInquiriesListSection;
