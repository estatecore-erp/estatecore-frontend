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

const mockProperty = {
  id: 1,
  title: "Modern Villa",
  description: "3 bedroom villa with garden",
  type: "sale",
  status: "available",
  price: "250000.00",
  location: "Colombo 07",
};

const PropertyEditSection = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // TODO: connect to API later
    console.log({
      title: formData.get("title"),
      description: formData.get("description"),
      type: formData.get("type"),
      status: formData.get("status"),
      price: formData.get("price"),
      location: formData.get("location"),
    });

    setTimeout(() => {
      setLoading(false);
      router.push(`/dashboard/properties/${mockProperty.id}`);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-semibold">Edit property</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            id="title"
            name="title"
            defaultValue={mockProperty.title}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Input
            id="description"
            name="description"
            defaultValue={mockProperty.description}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="type">Type</FieldLabel>
            <Select name="type" defaultValue={mockProperty.type}>
              <SelectTrigger id="type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Sale</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <Select name="status" defaultValue={mockProperty.status}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="rented">Rented</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="price">Price (LKR)</FieldLabel>
          <Input
            id="price"
            name="price"
            type="number"
            defaultValue={mockProperty.price}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="location">Location</FieldLabel>
          <Input
            id="location"
            name="location"
            defaultValue={mockProperty.location}
            required
          />
        </Field>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Saving..." : "Save changes"}
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href={`/dashboard/properties/${mockProperty.id}`}>
              Cancel
            </Link>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PropertyEditSection;