"use client";

import Link from "next/link";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
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
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { PAGE_SIZE, statusVariant } from "@/lib/constants";
import { User, ApiResponse } from "@/types";
import UserViewDialog from "./UserViewDialog";
import UserDeleteDialog from "./UserDeleteDialog";

const UsersListSection = () => {
  const { isAdmin } = useAuthStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "agent" | "client">("all");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewUser, setViewUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const json: ApiResponse<{ data: User[] } | User[]> = await res.json();
      if (json.success && json.data) {
        const list = Array.isArray(json.data) ? json.data : json.data.data;
        setUsers(list || []);
      } else {
        toast.error("Failed to load users");
      }
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };

    loadUsers();
  }, []);

  const filtered = users
    .filter((u) => (tab === "all" ? true : u.role === tab))
    .filter((u) =>
      search
        ? u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
        : true,
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <div className="p-4 text-center">Loading users...</div>;

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Users</h1>
        {isAdmin() && (
          <Button asChild>
            <Link href="/dashboard/users/create">
              <Plus className="w-4 h-4 mr-2" />
              Add agent
            </Link>
          </Button>
        )}
      </div>

      {/* SEARCH + TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Input
          placeholder="Search users by name or email"
          className="max-w-md"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        {isAdmin() && (
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
              variant={tab === "agent" ? "default" : "outline"}
              onClick={() => {
                setTab("agent");
                setPage(1);
              }}
            >
              Agents
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
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-6"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {user.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${statusVariant[user.role]} w-20 justify-center capitalize`}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.phone || "N/A"}
                  </TableCell>
                  <TableCell className="text-right space-x-2 whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewUser(user)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    {isAdmin() && (
                      <>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/users/${user.id}/edit`}>
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setUserToDelete(user)}
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

      {/* VIEW DIALOG */}
      <UserViewDialog
        user={viewUser}
        onOpenChange={(open) => !open && setViewUser(null)}
      />

      {/* DELETE DIALOG */}
      <UserDeleteDialog
        user={userToDelete}
        onOpenChange={(open) => !open && setUserToDelete(null)}
        onSuccess={() => fetchUsers()}
      />
    </div>
  );
};

export default UsersListSection;
