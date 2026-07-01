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
import { Textarea } from "@/components/ui/textarea";

const PropertyCreateSection = () => {
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
      title: formData.get("title"),
      description: formData.get("description"),
      type: formData.get("type"),
      price: formData.get("price"),
      location: formData.get("location"),
    });

    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard/properties");
    }, 1000);
  };

  return (
    <Card className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent className="space-y-6">
          <h1 className="text-2xl font-semibold">Add property</h1>

          <FieldGroup>
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                name="title"
                placeholder="Enter title"
                required
              />
              <FieldError>{errors.title}</FieldError>
            </Field>

            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter description"
              />
              <FieldError>{errors.description}</FieldError>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field data-invalid={!!errors.type}>
                <FieldLabel htmlFor="type">Type</FieldLabel>
                <Select name="type" defaultValue="sale">
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError>{errors.type}</FieldError>
              </Field>

              <Field data-invalid={!!errors.price}>
                <FieldLabel htmlFor="price">Price (LKR)</FieldLabel>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Enter price"
                  required
                />
                <FieldError>{errors.price}</FieldError>
              </Field>
            </div>

            <Field data-invalid={!!errors.location}>
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <Input
                id="location"
                name="location"
                placeholder="Enter location"
                required
              />
              <FieldError>{errors.location}</FieldError>
            </Field>

            {errors.general && (
              <p className="text-sm text-destructive">{errors.general}</p>
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Creating..." : "Create property"}
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/dashboard/properties">Cancel</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PropertyCreateSection;
