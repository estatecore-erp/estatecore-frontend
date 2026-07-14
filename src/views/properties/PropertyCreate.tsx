"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { ApiResponse, PropertyAgent } from "@/types";

const PropertyCreateSection = () => {
  const router = useRouter();
  const { isAdmin } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [agents, setAgents] = useState<PropertyAgent[]>([]);

  useEffect(() => {
    if (isAdmin()) {
      const fetchAgents = async () => {
        setAgentsLoading(true);
        try {
          const res = await fetch("/api/users?type=employee");
          const json: ApiResponse<PropertyAgent[]> = await res.json();
          if (json.success) setAgents(json.data);
        } catch (error) {
          console.error("Failed to fetch agents", error);
          toast.error("Failed to load agents");
        } finally {
          setAgentsLoading(false);
        }
      };
      fetchAgents();
    }
  }, [isAdmin]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setImagePreview(null);
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/properties", {
        method: "POST",
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
          const message = json.message || "Failed to create property";
          setErrors({ general: message });
          toast.error(message);
        }
        setLoading(false);
        return;
      }

      toast.success("Property created successfully");
      router.push("/dashboard/properties");
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent className="space-y-6">
          <h1 className="text-2xl font-semibold">Add property</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: form fields */}
            <div className="md:col-span-1">
              <FieldGroup>
                <Field data-invalid={!!errors.title}>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    id="title"
                    name="title"
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
                    placeholder="Enter description"
                  />
                  <FieldError>{errors.description}</FieldError>
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field data-invalid={!!errors.type}>
                    <FieldLabel htmlFor="type">Type</FieldLabel>
                    <Select name="type" defaultValue="sale">
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

                  <Field data-invalid={!!errors.price}>
                    <FieldLabel htmlFor="price">Price (LKR)</FieldLabel>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="Enter price"
                      required
                    />
                    <FieldError>{errors.price}</FieldError>
                  </Field>
                </div>

                <Field data-invalid={!!errors.location}>
                  <FieldLabel htmlFor="location">Location</FieldLabel>
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter location"
                    required
                  />
                  <FieldError>{errors.location}</FieldError>
                </Field>

                {isAdmin() && (
                  <Field data-invalid={!!errors.agent_id}>
                    <FieldLabel htmlFor="agent_id">Assign Agent</FieldLabel>
                    <Select name="agent_id">
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
                    <FieldError>{errors.agent_id}</FieldError>
                  </Field>
                )}

                {errors.general && (
                  <p className="text-sm text-destructive">{errors.general}</p>
                )}
              </FieldGroup>
            </div>

            {/* Right: image upload */}
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
            {loading ? "Creating..." : "Create property"}
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/dashboard/properties">Cancel</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PropertyCreateSection;
