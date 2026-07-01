"use client";

import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { statusVariant } from "@/lib/constants";

const mockProperty = {
  id: 1,
  title: "Modern Villa",
  description: "3 bedroom villa with garden",
  type: "sale",
  status: "available",
  price: "250000.00",
  location: "Colombo 07",
  agent: { name: "Jane Agent" },
};

const PropertyDetailSection = () => {
  const router = useRouter();

  const handleDelete = () => {
    // TODO: connect to API later
    console.log("delete property", mockProperty.id);
    router.push("/dashboard/properties");
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-semibold">Property details</h1>

      <div className="border rounded-lg divide-y">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-4">
          <span className="text-sm text-muted-foreground">Title</span>
          <span className="text-sm font-medium sm:text-right">{mockProperty.title}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 p-4">
          <span className="text-sm text-muted-foreground shrink-0">Description</span>
          <span className="text-sm sm:text-right sm:max-w-[70%]">{mockProperty.description}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-4">
          <span className="text-sm text-muted-foreground">Type</span>
          <span className="text-sm capitalize">{mockProperty.type}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-4">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge className={`${statusVariant[mockProperty.status]} capitalize w-fit`}>
            {mockProperty.status}
          </Badge>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-4">
          <span className="text-sm text-muted-foreground">Price</span>
          <span className="text-sm">{formatCurrency(mockProperty.price)}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-4">
          <span className="text-sm text-muted-foreground">Location</span>
          <span className="text-sm">{mockProperty.location}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 p-4">
          <span className="text-sm text-muted-foreground">Agent</span>
          <span className="text-sm">{mockProperty.agent.name}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="w-full sm:w-auto">
          <Link href={`/dashboard/properties/${mockProperty.id}/edit`}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Link>
        </Button>
        <Button variant="destructive" onClick={handleDelete} className="w-full sm:w-auto">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/dashboard/properties">Cancel</Link>
        </Button>
      </div>
    </div>
  );
};

export default PropertyDetailSection;