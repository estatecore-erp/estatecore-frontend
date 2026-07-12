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

import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

const UserCreateSection = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

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
      router.push("/dashboard/users");
    }, 1000);
  };

  return (
    <Card className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent className="space-y-6">
          <h1 className="text-2xl font-semibold">Add user</h1>

          <FieldGroup>
            {/* NAME */}
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="Enter full name"
                required
              />
              <FieldError>{errors.name}</FieldError>
            </Field>

            {/* EMAIL */}
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                required
              />
              <FieldError>{errors.email}</FieldError>
            </Field>

            {/* TYPE + STATUS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* TYPE */}
              <Field data-invalid={!!errors.type}>
                <FieldLabel htmlFor="type">User Type</FieldLabel>
                <Select name="type" defaultValue="client">
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError>{errors.type}</FieldError>
              </Field>

              {/* STATUS */}
              <Field data-invalid={!!errors.status}>
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <Select name="status" defaultValue="active">
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError>{errors.status}</FieldError>
              </Field>
            </div>
          </FieldGroup>
        </CardContent>

        {/* FOOTER */}
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? "Creating..." : "Create user"}
          </Button>

          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/dashboard/users">Cancel</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserCreateSection;