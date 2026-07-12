"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
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
import { ApiResponse, Property, Client } from "@/types";

const LeaseCreateSection = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);

  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const query = new URLSearchParams({
          type: "rent",
          status: "available",
          per_page: "100",
        });
        const res = await fetch(`/api/properties?${query.toString()}`);
        const json: ApiResponse<{ data: Property[] }> = await res.json();
        if (json.success && json.data) {
          setProperties((json.data.data || json.data) as Property[]);
        }
      } catch (error) {
        console.error("Failed to fetch properties", error);
        toast.error("Failed to load properties");
      } finally {
        setPropertiesLoading(false);
      }
    };

    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients");
        const json: ApiResponse<{ data: Client[] } | Client[]> =
          await res.json();
        if (json.success && json.data) {
          const clientsData =
            (json.data as { data: Client[] }).data || json.data;
          setClients(clientsData as Client[]);
        }
      } catch (error) {
        console.error("Failed to fetch clients", error);
        toast.error("Failed to load clients");
      } finally {
        setClientsLoading(false);
      }
    };

    fetchProperties();
    fetchClients();
  }, []);

  const handlePropertyChange = (val: string) => {
    setSelectedPropertyId(val);
    const property = properties.find((p) => p.id.toString() === val);
    setMonthlyRent(property ? property.price.toString() : "");
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const body = {
      property_id: Number(formData.get("property_id")),
      client_id: Number(formData.get("client_id")),
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date"),
      monthly_rent: Number(formData.get("monthly_rent")),
    };

    try {
      const res = await fetch("/api/leases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (!res.ok) {
        if (json.errors) {
          const fieldErrors: Record<string, string> = {};
          Object.entries(json.errors).forEach(([key, value]) => {
            fieldErrors[key] = Array.isArray(value) ? value[0] : String(value);
          });
          setErrors(fieldErrors);
          toast.error("Please fix the errors in the form");
        } else {
          const message = json.message || "Failed to create lease";
          setErrors({ general: message });
          toast.error(message);
        }
        setLoading(false);
        return;
      }

      toast.success("Lease created successfully");
      router.push("/dashboard/leases");
    } catch (error) {
      console.error("Failed to create lease", error);
      setErrors({ general: "Something went wrong. Please try again." });
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent className="space-y-6">
          <h1 className="text-2xl font-semibold">Add lease</h1>

          <FieldGroup>
            <Field data-invalid={!!errors.property_id}>
              <FieldLabel htmlFor="property_id">Property</FieldLabel>
              <Select
                name="property_id"
                value={selectedPropertyId}
                onValueChange={handlePropertyChange}
              >
                <SelectTrigger id="property_id" className="w-full">
                  <SelectValue placeholder="Select a property" />
                </SelectTrigger>
                <SelectContent>
                  {propertiesLoading ? (
                    <SelectItem
                      value="loading"
                      disabled
                      className="text-muted-foreground"
                    >
                      Loading properties...
                    </SelectItem>
                  ) : properties.length > 0 ? (
                    properties.map((property) => (
                      <SelectItem
                        key={property.id}
                        value={property.id.toString()}
                      >
                        {property.title} — {property.location}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No properties available for rent
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FieldError>{errors.property_id}</FieldError>
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field data-invalid={!!errors.client_id}>
                <FieldLabel htmlFor="client_id">Client</FieldLabel>
                <Select name="client_id">
                  <SelectTrigger id="client_id" className="w-full">
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientsLoading ? (
                      <SelectItem
                        value="loading"
                        disabled
                        className="text-muted-foreground"
                      >
                        Loading clients...
                      </SelectItem>
                    ) : clients.length > 0 ? (
                      clients.map((client) => (
                        <SelectItem
                          key={client.id}
                          value={client.id.toString()}
                        >
                          {client.user.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No clients available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FieldError>{errors.client_id}</FieldError>
              </Field>

              <Field data-invalid={!!errors.monthly_rent}>
                <FieldLabel htmlFor="monthly_rent">
                  Monthly rent (LKR)
                </FieldLabel>
                <Input
                  id="monthly_rent"
                  name="monthly_rent"
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  required
                />
                <FieldError>{errors.monthly_rent}</FieldError>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field data-invalid={!!errors.start_date}>
                <FieldLabel htmlFor="start_date">Start date</FieldLabel>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  min={today}
                  required
                />
                <FieldError>{errors.start_date}</FieldError>
              </Field>

              <Field data-invalid={!!errors.end_date}>
                <FieldLabel htmlFor="end_date">End date</FieldLabel>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  min={today}
                  required
                />
                <FieldError>{errors.end_date}</FieldError>
              </Field>
            </div>

            {errors.general && (
              <p className="text-sm text-destructive">{errors.general}</p>
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Creating..." : "Create lease"}
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/dashboard/leases">Cancel</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LeaseCreateSection;
