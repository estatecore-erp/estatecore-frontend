"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { User, ApiResponse } from "@/types";

const UserEditSection = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${params.id}`);
        const json: ApiResponse<User> = await res.json();
        if (json.success) setUser(json.data);
        else toast.error("Failed to load user");
      } catch {
        toast.error("Failed to load user");
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [params.id]);

  const handleUpdate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        body: formData,
      });
      const json = await res.json();

      if (!res.ok) {
        if (json.errors) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(json.errors).forEach(([key, value]) => {
            fieldErrors[key] = Array.isArray(value) ? value[0] : String(value);
          });
          setErrors(fieldErrors);
          toast.error("Please fix the errors in the form");
        } else {
          toast.error(json.message || "Failed to update user");
        }
        setLoading(false);
        return;
      }

      toast.success("User updated successfully");
      router.push("/dashboard/users");
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-4 text-center">Loading user...</div>;
  if (!user) return <div className="p-4 text-center">User not found</div>;

  return (
    <Card className="max-w-3xl">
      <form onSubmit={handleUpdate} className="space-y-4">
        <CardContent className="space-y-6">
          <h1 className="text-2xl font-semibold">Edit {user.role}</h1>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" name="name" defaultValue={user.name} required />
              <FieldError>{errors.name}</FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                disabled
              />
            </Field>

            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input
                id="phone"
                name="phone"
                defaultValue={user.phone ?? ""}
                required
              />
              <FieldError>{errors.phone}</FieldError>
            </Field>

            {user.role === "client" && (
              <Field data-invalid={!!errors.address}>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Input
                  id="address"
                  name="address"
                  defaultValue={user.address ?? ""}
                  required
                />
                <FieldError>{errors.address}</FieldError>
              </Field>
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Saving..." : "Save changes"}
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/dashboard/users">Cancel</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserEditSection;
