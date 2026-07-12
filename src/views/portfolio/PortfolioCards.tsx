"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageOff, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Property, ApiResponse } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import toast from "react-hot-toast";

const ownershipVariant: Record<string, string> = {
  owned: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  rented: "bg-blue-100 text-blue-700 hover:bg-blue-100",
};

const PortfolioCardsSection = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch("/api/properties/portfolio");
        const json: ApiResponse<Property[]> = await res.json();

        if (json.success && json.data) {
          setProperties(json.data);
        } else {
          toast.error(json.message || "Failed to load your portfolio");
        }
      } catch (error) {
        console.error("Failed to fetch portfolio", error);
        toast.error("Failed to load your portfolio");
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading your portfolio...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">My Portfolio</h1>
      </div>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 text-center text-muted-foreground py-16 border rounded-lg border-dashed">
          <Home className="w-8 h-8" />
          <p>No properties in your portfolio</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {properties.map((property) => (
            <Link
              key={property.id}
              href={`/portal/properties/${property.id}`}
              className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-card"
            >
              {/* Image */}
              <div className="relative w-full h-48 overflow-hidden">
                {property.image_path ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${process.env.NEXT_PUBLIC_ASSET_URL}${property.image_path}`}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 border-b border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/30">
                    <ImageOff className="w-6 h-6" />
                    <span className="text-sm">No image</span>
                  </div>
                )}

                {property.ownership_type && (
                  <Badge
                    className={`${ownershipVariant[property.ownership_type]} absolute top-2 left-2 capitalize shrink-0 text-xs`}
                  >
                    {property.ownership_type === "owned" ? "Owned" : "Rented"}
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h2 className="text-sm font-medium leading-tight line-clamp-1">
                  {property.title}
                </h2>

                <p className="text-xs text-muted-foreground">
                  {property.location}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs capitalize text-muted-foreground">
                    {property.type}
                  </span>
                  <span className="text-sm font-medium">
                    {formatCurrency(property.price)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioCardsSection;
