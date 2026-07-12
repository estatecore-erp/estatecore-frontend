"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Card, CardContent } from "../ui/card";
import Logo from "@/../public/logo-wide.svg";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setErrors({ general: data.message || "Invalid credentials" });
        return;
      }

      setUser(data.user);

      if (data.user.role === "client") {
        router.push("/portal");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setErrors({ general: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <Image src={Logo} alt="logo-wide" className="h-10" />

        <div className="border-t" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              aria-invalid={!!errors.email}
              required
            />
            <FieldError>{errors.email}</FieldError>
          </Field>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              aria-invalid={!!errors.password}
              required
            />
            <FieldError>{errors.password}</FieldError>
          </Field>

          {errors.general && (
            <p className="text-sm text-destructive">{errors.general}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-primary hover:underline">
              Register
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
