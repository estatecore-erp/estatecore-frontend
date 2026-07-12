"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Property, ApiResponse } from "@/types";
import { statusVariant } from "@/lib/constants";
import { formatCurrency } from "@/lib/formatters";
import toast from "react-hot-toast";

const PropertiesCardsSection = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const query = new URLSearchParams({
          search: debouncedSearch,
          type,
        });
        const res = await fetch(`/api/properties?${query.toString()}`);
        const json: ApiResponse<{ data: Property[] }> = await res.json();
        if (json.success && json.data) {
          const propertiesData = json.data.data || json.data;
          setProperties(propertiesData || []);
        } else {
          toast.error("Failed to load properties");
        }
      } catch (error) {
        console.error("Failed to fetch properties", error);
        toast.error("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [debouncedSearch, type]);

  if (loading) {
    return <div className="p-4 text-center">Loading properties...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Properties</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          placeholder="Search by title or location"
          className="flex-1 max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={type} onValueChange={(val) => setType(val)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="sale">Sale</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {properties.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          No properties available now
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
              {property.image_path ? (
                <div className="w-full h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${process.env.NEXT_PUBLIC_ASSET_URL}${property.image_path}`}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-48 border-b border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/30">
                  <ImageOff className="w-6 h-6" />
                  <span className="text-sm">No image</span>
                </div>
              )}

              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-sm font-medium leading-tight line-clamp-1">
                    {property.title}
                  </h2>
                  <Badge
                    className={`${statusVariant[property.status]} capitalize shrink-0 text-xs`}
                  >
                    {property.status}
                  </Badge>
                </div>

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

export default PropertiesCardsSection;
