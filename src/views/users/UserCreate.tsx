"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const UserCreateSection = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (password !== confirmPassword) {
      setErrors({ confirm_password: "Passwords do not match" });

      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password,
          password_confirmation: confirmPassword,
          phone: formData.get("phone"),
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.errors) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(json.errors).forEach(([key, value]) => {
            fieldErrors[key] = Array.isArray(value) ? value[0] : String(value);
          });
          setErrors(fieldErrors);
          toast.error("Please fix the errors in the form");
        } else {
          toast.error(json.message || "Failed to create agent");
        }
        setLoading(false);
        return;
      }

      toast.success("Agent created successfully");
      router.push("/dashboard/users");
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent className="space-y-6">
          <h1 className="text-2xl font-semibold">Add agent</h1>

          <FieldGroup>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <Field data-invalid={!!errors.phone}>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter phone number"
                  required
                />
                <FieldError>{errors.phone}</FieldError>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  required
                  minLength={8}
                />
                <FieldError>{errors.password}</FieldError>
              </Field>

              <Field data-invalid={!!errors.confirm_password}>
                <FieldLabel htmlFor="confirm_password">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  placeholder="Re-enter password"
                  required
                  minLength={8}
                />
                <FieldError>{errors.confirm_password}</FieldError>
              </Field>
            </div>
          </FieldGroup>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Creating..." : "Create agent"}
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
