export type PropertyType = "sale" | "rent";
export type PropertyStatus = "available" | "sold" | "rented";

export type OwnershipType = "owned" | "rented";

export type PropertyAgent = {
  id: number;
  name: string;
  email: string;
};

export type PropertyInquiry = {
  id: number;
  message: string;
  status: string;
  client: {
    id: number;
    name: string;
    email: string;
  };
  created_at: string;
};

export type Property = {
  id: number;
  title: string;
  description?: string | null;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  location: string;
  image_path?: string | null;
  ownership_type?: OwnershipType;
  agent?: PropertyAgent;
  inquiries?: PropertyInquiry[];
  created_at: string;
  updated_at: string;
};

export type StorePropertyRequest = {
  title: string;
  description?: string;
  type?: PropertyType;
  price: number;
  location: string;
  agent_id?: number;
  image?: File;
};

export type UpdatePropertyRequest = {
  title?: string;
  description?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  price?: number;
  location?: string;
  image?: File;
};
