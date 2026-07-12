"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ImageOff, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { formatCurrency } from "@/lib/formatters";
import { statusVariant } from "@/lib/constants";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Property, ApiResponse } from "@/types";
import PropertyDeleteDialog from "./PropertyDelete";
import { useAuthStore } from "@/store/auth";

const PropertyDetailSection = () => {
  const { isAdmin } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${params.id}`);
        const json: ApiResponse<Property> = await res.json();
        if (json.success) {
          setProperty(json.data);
        } else {
          toast.error("Failed to load property");
        }
      } catch (error) {
        console.error("Failed to fetch property", error);
        toast.error("Failed to load property");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [params.id]);

  if (loading)
    return <div className="p-4 text-center">Loading property...</div>;
  if (!property)
    return <div className="p-4 text-center">Property not found</div>;

  return (
    <Card>
      <CardContent className="space-y-6">
        <h1 className="text-2xl font-semibold">Property details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: image */}
          <div className="md:col-span-1">
            {property?.image_path ? (
              <div className="w-full h-full min-h-40 md:min-h-64 rounded-lg overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${process.env.NEXT_PUBLIC_ASSET_URL}${property.image_path}`}
                  alt={property.title}
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
                {property.title}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 px-4 py-2 md:py-3">
              <span className="text-sm text-muted-foreground shrink-0">
                Description
              </span>
              <span className="text-sm sm:text-right sm:max-w-[70%]">
                {property.description}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-2 md:py-3">
              <span className="text-sm text-muted-foreground">Type</span>
              <span className="text-sm capitalize">{property.type}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-2 md:py-3">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                className={`${statusVariant[property.status]} capitalize w-fit`}
              >
                {property.status}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-2 md:py-3">
              <span className="text-sm text-muted-foreground">Price</span>
              <span className="text-sm">{formatCurrency(property.price)}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-2 md:py-3">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm">{property.location}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-2 md:py-3">
              <span className="text-sm text-muted-foreground">Agent</span>
              <span className="text-sm">{property.agent?.name || "N/A"}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button asChild className="w-full sm:w-auto">
          <Link href={`/dashboard/properties/${property.id}/edit`}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </Button>
        {isAdmin() && (
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        )}
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/dashboard/properties">Back</Link>
        </Button>
      </CardFooter>

      <PropertyDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        propertyId={property?.id}
        onSuccess={() => {
          router.push("/dashboard/properties");
          router.refresh();
        }}
      />
    </Card>
  );
};

export default PropertyDetailSection;
