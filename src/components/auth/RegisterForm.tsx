"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

export default function RegisterForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
          password_confirmation: formData.get("password_confirmation"),
          phone: formData.get("phone"),
          address: formData.get("address"),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrors({ general: data.message || "Registration failed" });
        return;
      }

      setUser(data.user);
      router.push("/portal");
    } catch {
      setErrors({ general: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field data-invalid={!!errors.name}>
        <FieldLabel htmlFor="name">Full Name</FieldLabel>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          required
        />
        <FieldError>{errors.name}</FieldError>
      </Field>

      <Field data-invalid={!!errors.email}>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john@gmail.com"
          required
        />
        <FieldError>{errors.email}</FieldError>
      </Field>

      <Field data-invalid={!!errors.phone}>
        <FieldLabel htmlFor="phone">Phone</FieldLabel>
        <Input id="phone" name="phone" type="tel" placeholder="0771234567" />
        <FieldError>{errors.phone}</FieldError>
      </Field>

      <Field data-invalid={!!errors.address}>
        <FieldLabel htmlFor="address">Address</FieldLabel>
        <Input
          id="address"
          name="address"
          type="text"
          placeholder="123 Main St"
        />
        <FieldError>{errors.address}</FieldError>
      </Field>

      <Field data-invalid={!!errors.password}>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
        <FieldError>{errors.password}</FieldError>
      </Field>

      <Field data-invalid={!!errors.password_confirmation}>
        <FieldLabel htmlFor="password_confirmation">
          Confirm Password
        </FieldLabel>
        <Input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          placeholder="••••••••"
          required
        />
        <FieldError>{errors.password_confirmation}</FieldError>
      </Field>

      {errors.general && (
        <p className="text-sm text-destructive">{errors.general}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Register"}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="text-primary hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}
