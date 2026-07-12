"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ImageOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { formatCurrency } from "@/lib/formatters";
import { statusVariant } from "@/lib/constants";
import { Property, ApiResponse } from "@/types";
import { useAuthStore } from "@/store/auth";
import toast from "react-hot-toast";

const PortalPropertyDetailSection = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // check if current user already submitted inquiry
  const existingInquiry = property?.inquiries?.find(
    (inq) => inq.client.id === user?.id,
  );

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${params.id}`);
        const json: ApiResponse<Property> = await res.json();
        if (json.success) setProperty(json.data);
      } catch (error) {
        console.error("Failed to fetch property", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [params.id]);

  const handleInquiry = async () => {
    setErrors({});

    if (!message.trim()) {
      setErrors({ message: "Message is required" });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_id: property?.id,
          message: message.trim(),
        }),
      });
      const json = await res.json();

      if (res.ok) {
        toast.success("Inquiry sent successfully!");
        router.push("/portal");
      } else {
        toast.error(json.message || "Failed to send inquiry");
      }
    } catch (error) {
      console.error("Failed to send inquiry", error);
      toast.error("An error occurred while sending the inquiry");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading property...</div>;
  }

  if (!property) {
    return <div className="p-4 text-center">Property not found</div>;
  }

  return (
    <Card>
      <CardContent className="space-y-6">
        <h1 className="text-2xl font-semibold">Property details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="md:col-span-1">
            {property.image_path ? (
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

          {/* Details */}
          <div className="md:col-span-1 border rounded-lg divide-y">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-3">
              <span className="text-sm text-muted-foreground">Title</span>
              <span className="text-sm font-medium sm:text-right">
                {property.title}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 px-4 py-3">
              <span className="text-sm text-muted-foreground shrink-0">
                Description
              </span>
              <span className="text-sm sm:text-right sm:max-w-[70%]">
                {property.description}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-3">
              <span className="text-sm text-muted-foreground">Type</span>
              <span className="text-sm capitalize">{property.type}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-3">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge
                className={`${statusVariant[property.status]} capitalize w-fit`}
              >
                {property.status}
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-3">
              <span className="text-sm text-muted-foreground">Price</span>
              <span className="text-sm">{formatCurrency(property.price)}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-3">
              <span className="text-sm text-muted-foreground">Location</span>
              <span className="text-sm">{property.location}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 px-4 py-3">
              <span className="text-sm text-muted-foreground">Agent</span>
              <span className="text-sm">{property.agent?.name || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Inquiry section */}
        <div className="space-y-3 border-t pt-6">
          <h2 className="text-base font-medium">Inquiry</h2>

          {existingInquiry ? (
            // already submitted — show sent message
            <div className="border rounded-lg p-4 space-y-2 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Your inquiry
                </span>
                <Badge
                  className={`${statusVariant[existingInquiry.status]} capitalize w-fit`}
                >
                  {existingInquiry.status}
                </Badge>
              </div>
              <p className="text-sm">{existingInquiry.message}</p>
              <p className="text-xs text-muted-foreground">
                {existingInquiry.created_at}
              </p>
            </div>
          ) : (
            // show inquiry form
            <Field data-invalid={!!errors.message}>
              <FieldLabel htmlFor="message">Message</FieldLabel>
              <textarea
                id="message"
                className="w-full min-h-25 rounded-md border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="I am interested in this property. Please provide more details."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <FieldError>{errors.message}</FieldError>
            </Field>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
        {!existingInquiry && (
          <Button
            onClick={handleInquiry}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Sending..." : "Make inquiry"}
          </Button>
        )}
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/portal">Cancel</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PortalPropertyDetailSection;
