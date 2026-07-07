"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ImagePlus, X } from "lucide-react";
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

const mockProperty = {
  id: 1,
  title: "Modern Villa",
  description: "3 bedroom villa with garden",
  type: "sale",
  status: "available",
  price: "250000.00",
  location: "Colombo 07",
  imageUrl: "/mock/modern-villa.jpg", // existing image from backend
};

const PropertyEditSection = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    mockProperty.imageUrl,
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setImagePreview(null);
  };

  const handleUpdate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // TODO: connect to API later — only send "image" if a new file was picked
    console.log({
      title: formData.get("title"),
      description: formData.get("description"),
      type: formData.get("type"),
      status: formData.get("status"),
      price: formData.get("price"),
      location: formData.get("location"),
      image: formData.get("image"),
    });

    setTimeout(() => {
      setLoading(false);
      router.push(`/dashboard/properties/${mockProperty.id}`);
    }, 1000);
  };

  return (
    <Card>
      <form onSubmit={handleUpdate} className="space-y-4">
        <CardContent className="space-y-6">
          <h1 className="text-2xl font-semibold">Edit property</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: form fields */}
            <div className="md:col-span-1 space-y-4">
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
            </div>

            {/* Right: image, prefilled with existing */}
            <div className="md:col-span-1">
              <Field>
                <FieldLabel htmlFor="image">Property image</FieldLabel>

                {imagePreview ? (
                  <div className="relative w-full h-64 md:h-full min-h-64 rounded-md border overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={clearImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center gap-2 w-full h-64 md:h-full min-h-64 rounded-md border border-dashed cursor-pointer text-muted-foreground hover:bg-muted/50 transition-colors"
                  >
                    <ImagePlus className="w-6 h-6" />
                    <span className="text-sm">Click to upload an image</span>
                  </label>
                )}

                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </Field>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Saving..." : "Save changes"}
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href={`/dashboard/properties/${mockProperty.id}`}>
              Cancel
            </Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PropertyEditSection;
