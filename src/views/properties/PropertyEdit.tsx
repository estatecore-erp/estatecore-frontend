"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ImagePlus, X } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth";
import { ApiResponse, Property, PropertyAgent } from "@/types";

const PropertyEditSection = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [agents, setAgents] = useState<PropertyAgent[]>([]);
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propRes = await fetch(`/api/properties/${params.id}`);
        const propJson: ApiResponse<Property> = await propRes.json();

        if (propJson.success) {
          setProperty(propJson.data);
          if (propJson.data.image_path) {
            setImagePreview(
              `${process.env.NEXT_PUBLIC_ASSET_URL}${propJson.data.image_path}`,
            );
          }
        } else {
          toast.error("Failed to load property");
        }

        if (user?.role === "admin") {
          setAgentsLoading(true);
          const agentRes = await fetch("/api/users?role=agent");
          const agentJson: ApiResponse<PropertyAgent[]> = await agentRes.json();
          if (agentJson.success) setAgents(agentJson.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load property");
      } finally {
        setAgentsLoading(false);
      }
    };
    fetchData();
  }, [params.id, user]);

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
    setErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(`/api/properties/${params.id}`, {
        method: "PUT",
        body: formData,
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
          const message = json.message || "Failed to update property";
          setErrors({ general: message });
          toast.error(message);
        }
        setLoading(false);
        return;
      }

      toast.success("Property updated successfully");
      router.push(`/dashboard/properties/${params.id}`);
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (!property)
    return <div className="p-4 text-center">Loading property...</div>;

  return (
    <Card>
      <form onSubmit={handleUpdate} className="space-y-4">
        <CardContent className="space-y-6">
          <h1 className="text-2xl font-semibold">Edit property</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: form fields */}
            <div className="md:col-span-1">
              <FieldGroup>
                <Field data-invalid={!!errors.title}>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={property.title}
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
                    defaultValue={property.description || ""}
                    placeholder="Enter description"
                  />
                  <FieldError>{errors.description}</FieldError>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field data-invalid={!!errors.type}>
                    <FieldLabel htmlFor="type">Type</FieldLabel>
                    <Select name="type" defaultValue={property.type}>
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

                  <Field data-invalid={!!errors.status}>
                    <FieldLabel htmlFor="status">Status</FieldLabel>
                    <Select name="status" defaultValue={property.status}>
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                        <SelectItem value="sold">Sold</SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldError>{errors.status}</FieldError>
                  </Field>
                </div>

                <Field data-invalid={!!errors.price}>
                  <FieldLabel htmlFor="price">Price (LKR)</FieldLabel>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    defaultValue={property.price}
                    placeholder="Enter price"
                    required
                  />
                  <FieldError>{errors.price}</FieldError>
                </Field>

                <Field data-invalid={!!errors.location}>
                  <FieldLabel htmlFor="location">Location</FieldLabel>
                  <Input
                    id="location"
                    name="location"
                    defaultValue={property.location}
                    placeholder="Enter location"
                    required
                  />
                  <FieldError>{errors.location}</FieldError>
                </Field>

                {user?.role === "admin" && (
                  <Field data-invalid={!!errors.agent_id}>
                    <FieldLabel htmlFor="agent_id">Assign Agent</FieldLabel>
                    <Select
                      name="agent_id"
                      defaultValue={property.agent?.id.toString()}
                      onValueChange={(val) => {
                        const input = document.getElementById(
                          "agent_id_hidden",
                        ) as HTMLInputElement;
                        if (input) input.value = val;
                      }}
                    >
                      <SelectTrigger id="agent_id" className="w-full">
                        <SelectValue placeholder="Select an agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentsLoading ? (
                          <SelectItem
                            value="loading"
                            disabled
                            className="text-muted-foreground"
                          >
                            Loading agents...
                          </SelectItem>
                        ) : agents.length > 0 ? (
                          agents.map((agent) => (
                            <SelectItem
                              key={agent.id}
                              value={agent.id.toString()}
                            >
                              {agent.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No agents available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <input
                      type="hidden"
                      name="agent_id"
                      id="agent_id_hidden"
                      defaultValue={property.agent?.id}
                    />
                    <FieldError>{errors.agent_id}</FieldError>
                  </Field>
                )}

                {errors.general && (
                  <p className="text-sm text-destructive">{errors.general}</p>
                )}
              </FieldGroup>
            </div>

            {/* Right: image, prefilled with existing */}
            <div className="md:col-span-1">
              <Field data-invalid={!!errors.image}>
                <FieldLabel htmlFor="image">Property image</FieldLabel>

                {imagePreview ? (
                  <div className="relative w-full h-64 md:h-full min-h-64 rounded-md border overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
                <FieldError>{errors.image}</FieldError>
              </Field>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Updating..." : "Save changes"}
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href={`/dashboard/properties/${property?.id}`}>Cancel</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PropertyEditSection;
