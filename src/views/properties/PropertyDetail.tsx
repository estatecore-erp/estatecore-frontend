"use client";

import { useRouter } from "next/navigation";
import { ImageOff, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { statusVariant } from "@/lib/constants";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const mockProperty = {
  id: 1,
  title: "Modern Villa",
  description: "3 bedroom villa with garden",
  type: "sale",
  status: "available",
  price: "250000.00",
  location: "Colombo 07",
  agent: { name: "Jane Agent" },
  imageUrl: "/mock/modern-villa.jpg", // set to null to test placeholder
};

const PropertyDetailSection = () => {
  const router = useRouter();

  const handleDelete = () => {
    // TODO: connect to API later
    console.log("delete property", mockProperty.id);
    router.push("/dashboard/properties");
  };

  return (
    <Card>
      <CardContent className="space-y-6">
        <h1 className="text-2xl font-semibold">Property details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: image */}
          <div className="md:col-span-1">
            {mockProperty.imageUrl ? (
              <div className="w-full h-full min-h-40 md:min-h-64 rounded-lg overflow-hidden border">
                <img
                  src={mockProperty.imageUrl}
                  alt={mockProperty.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-full min-h-40 md:min-h-64 rounded-lg border border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImageOff className="w-6 h-6" />
                <span className="text-sm">No image available</span>
              </div>
            )}
          </div>

          {/* Right: details */}
          <div className="md:col-span-1 border rounded-lg divide-y">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-2 md:py-3">
              <span className="text-sm text-muted-foreground">Title</span>
              <span className="text-sm font-medium sm:text-right">
                {mockProperty.title}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 px-4 py-2 md:py-3">
              <span className="text-sm text-muted-foreground shrink-0">
                Description
              </span>
              <span className="text-sm sm:text-right sm:max-w-[70%]">
                {mockProperty.description}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-2 md:py-3">
              <span className="text-sm text-muted-foreground">Type</span>
              <span className="text-sm capitalize">{mockProperty.type}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-2 md:py-3">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                className={`${statusVariant[mockProperty.status]} capitalize w-fit`}
              >
                {mockProperty.status}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-2 md:py-3">
              <span className="text-sm text-muted-foreground">Price</span>
              <span className="text-sm">
                {formatCurrency(mockProperty.price)}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-2 md:py-3">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm">{mockProperty.location}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-2 md:py-3">
              <span className="text-sm text-muted-foreground">Agent</span>
              <span className="text-sm">{mockProperty.agent.name}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button asChild className="w-full sm:w-auto">
          <Link href={`/dashboard/properties/${mockProperty.id}/edit`}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          className="w-full sm:w-auto"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/dashboard/properties">Back</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyDetailSection;
