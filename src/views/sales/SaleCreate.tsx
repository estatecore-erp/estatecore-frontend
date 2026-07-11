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
  FieldDescription,
} from "@/components/ui/field";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const SaleCreateSection = () => {
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
      salePrice: formData.get("salePrice"),
      saleDate: formData.get("saleDate"),
    });

    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard/sales");
    }, 1000);
  };

  return (
    <Card className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent className="space-y-6">
          <h1 className="text-2xl font-semibold">Add sale</h1>

          <FieldGroup>
            <Field data-invalid={!!errors.property}>
              <FieldLabel htmlFor="property">Property</FieldLabel>
              <Select name="property">
                <SelectTrigger id="property" className="w-full">
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="luxury-villa">
                    Luxury Villa — Colombo 07
                  </SelectItem>
                  <SelectItem value="hillside-bungalow">
                    Hillside Bungalow — Kandy
                  </SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>Sale + available only</FieldDescription>
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
                    <SelectItem value="ama-perera">Ama Perera</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError>{errors.client}</FieldError>
              </Field>

              <Field data-invalid={!!errors.salePrice}>
                <FieldLabel htmlFor="salePrice">Sale price (LKR)</FieldLabel>
                <Input
                  id="salePrice"
                  name="salePrice"
                  type="number"
                  placeholder="490000"
                  required
                />
                <FieldError>{errors.salePrice}</FieldError>
              </Field>
            </div>

            <Field data-invalid={!!errors.saleDate}>
              <FieldLabel htmlFor="saleDate">Sale date</FieldLabel>
              <Input id="saleDate" name="saleDate" type="date" required />
              <FieldError>{errors.saleDate}</FieldError>
            </Field>

            {errors.general && (
              <p className="text-sm text-destructive">{errors.general}</p>
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Creating..." : "Create sale"}
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/dashboard/sales">Cancel</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SaleCreateSection;
