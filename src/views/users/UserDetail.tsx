"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  type: "client",
  status: "active",
};

const UserDetailSection = () => {
  const router = useRouter();

  const handleDelete = () => {
    // MOCK ONLY (NO BACKEND YET)
    console.log("delete user", mockUser.id);

    router.push("/dashboard/users");
  };

  return (
    <Card className="max-w-3xl">
      <CardContent className="space-y-6">
        <h1 className="text-2xl font-semibold">User details</h1>

        {/* DETAILS GRID */}
        <div className="border rounded-lg divide-y">
          {/* NAME */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-4">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="text-sm font-medium sm:text-right">
              {mockUser.name}
            </span>
          </div>

          {/* EMAIL */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-4">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm sm:text-right">{mockUser.email}</span>
          </div>

          {/* TYPE */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-4">
            <span className="text-sm text-muted-foreground">Type</span>
            <span className="text-sm capitalize">{mockUser.type}</span>
          </div>

          {/* STATUS */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-4">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge
              className={
                mockUser.status === "active"
                  ? "bg-green-100 text-green-800 capitalize"
                  : "bg-red-100 text-red-800 capitalize"
              }
            >
              {mockUser.status}
            </Badge>
          </div>
        </div>
      </CardContent>

      {/* ACTIONS */}
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button asChild className="w-full sm:w-auto">
          <Link href={`/dashboard/users/${mockUser.id}/edit`}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </Button>

        <Button
          variant="destructive"
          onClick={handleDelete}
          className="w-full sm:w-auto"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>

        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/dashboard/users">Back</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserDetailSection;
