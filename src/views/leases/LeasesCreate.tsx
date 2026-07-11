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

const LeaseCreateSection = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    // TODO: connect to API later
    console.log({
      property: formData.get("property"),
      client: formData.get("client"),
      monthlyRent: formData.get("monthlyRent"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
    });

    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard/leases");
    }, 1000);
  };

  return (
    <Card className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent className="space-y-6">
          <h1 className="text-2xl font-semibold">Add lease</h1>

          <FieldGroup>
            <Field data-invalid={!!errors.property}>
              <FieldLabel htmlFor="property">Property</FieldLabel>
              <Select name="property">
                <SelectTrigger id="property" className="w-full">
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="city-apartment">
                    City Apartment — Colombo 03
                  </SelectItem>
                  <SelectItem value="sea-view-flat">
                    Sea View Flat — Galle
                  </SelectItem>
                </SelectContent>
              </Select>
              <FieldError>{errors.property}</FieldError>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field data-invalid={!!errors.client}>
                <FieldLabel htmlFor="client">Client</FieldLabel>
                <Select name="client">
                  <SelectTrigger id="client" className="w-full">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-client">John Client</SelectItem>
                    <SelectItem value="sam-client">Sam Client</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError>{errors.client}</FieldError>
              </Field>

              <Field data-invalid={!!errors.monthlyRent}>
                <FieldLabel htmlFor="monthlyRent">
                  Monthly rent (LKR)
                </FieldLabel>
                <Input
                  id="monthlyRent"
                  name="monthlyRent"
                  type="number"
                  placeholder="25000"
                  readOnly
                  required
                />
                <FieldError>{errors.monthlyRent}</FieldError>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field data-invalid={!!errors.startDate}>
                <FieldLabel htmlFor="startDate">Start date</FieldLabel>
                <Input id="startDate" name="startDate" type="date" required />
                <FieldError>{errors.startDate}</FieldError>
              </Field>

              <Field data-invalid={!!errors.endDate}>
                <FieldLabel htmlFor="endDate">End date</FieldLabel>
                <Input id="endDate" name="endDate" type="date" required />
                <FieldError>{errors.endDate}</FieldError>
              </Field>
            </div>

            {errors.general && (
              <p className="text-sm text-destructive">{errors.general}</p>
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Creating..." : "Create lease"}
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/dashboard/leases">Cancel</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LeaseCreateSection;
