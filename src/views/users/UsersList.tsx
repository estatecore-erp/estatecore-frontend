"use client";

import Link from "next/link";
import { Eye, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
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

import { PAGE_SIZE } from "@/lib/constants";

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    type: "client",
    status: "active",
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@example.com",
    type: "employee",
    status: "active",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    type: "client",
    status: "inactive",
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david@example.com",
    type: "employee",
    status: "active",
  },
  {
    id: 5,
    name: "Emma Johnson",
    email: "emma@example.com",
    type: "client",
    status: "active",
  },
];

const UsersListSection = () => {
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<"all" | "client" | "employee">("all");

  const filteredUsers =
    tab === "all"
      ? mockUsers
      : mockUsers.filter((u) => u.type === tab);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Users</h1>

        <Button asChild>
          <Link href="/dashboard/users/create">
            <Plus className="w-4 h-4 mr-2" />
            Add user
          </Link>
        </Button>
      </div>

      {/* SEARCH + TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Input
          placeholder="Search users by name or email"
          className="max-w-md"
        />

        <div className="flex gap-2">
          <Button
            variant={tab === "all" ? "default" : "outline"}
            onClick={() => {
              setTab("all");
              setPage(1);
            }}
          >
            All
          </Button>

          <Button
            variant={tab === "client" ? "default" : "outline"}
            onClick={() => {
              setTab("client");
              setPage(1);
            }}
          >
            Clients
          </Button>

          <Button
            variant={tab === "employee" ? "default" : "outline"}
            onClick={() => {
              setTab("employee");
              setPage(1);
            }}
          >
            Employees
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {user.name}
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  {user.email}
                </TableCell>

                <TableCell className="capitalize">
                  {user.type}
                </TableCell>

                <TableCell>
                  <Badge
                    className={`${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    } capitalize w-24 justify-center`}
                  >
                    {user.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-right space-x-2 whitespace-nowrap">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/users/${user.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>

                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/users/${user.id}/edit`}>
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
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
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default UsersListSection;