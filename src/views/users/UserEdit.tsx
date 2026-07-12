"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Field, FieldLabel } from "@/components/ui/field";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  type: "client",
  status: "active",
};

const UserEditSection = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // MOCK ONLY (NO BACKEND YET)
    console.log({
      name: formData.get("name"),
      email: formData.get("email"),
      type: formData.get("type"),
      status: formData.get("status"),
    });

    setTimeout(() => {
      setLoading(false);
      router.push(`/dashboard/users/${mockUser.id}`);
    }, 1000);
  };

  return (
    <Card className="max-w-3xl">
      <form onSubmit={handleUpdate} className="space-y-4">
        <CardContent className="space-y-6">
          <h1 className="text-2xl font-semibold">Edit user</h1>

          {/* NAME */}
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              name="name"
              defaultValue={mockUser.name}
              required
            />
          </Field>

          {/* EMAIL */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={mockUser.email}
              required
            />
          </Field>

          {/* TYPE + STATUS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* TYPE */}
            <Field>
              <FieldLabel htmlFor="type">User Type</FieldLabel>
              <Select name="type" defaultValue={mockUser.type}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {/* STATUS */}
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select name="status" defaultValue={mockUser.status}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </Field>

          </div>
        </CardContent>

        {/* FOOTER */}
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Saving..." : "Save changes"}
          </Button>

          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href={`/dashboard/users/${mockUser.id}`}>
              Cancel
            </Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserEditSection;