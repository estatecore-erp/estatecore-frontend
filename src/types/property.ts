export type PropertyType = "sale" | "rent";
export type PropertyStatus = "available" | "sold" | "rented";

export type Agent = {
  id: number;
  name: string;
  email: string;
};

export type Property = {
  id: number;
  title: string;
  description?: string;
  type: PropertyType;
  status: PropertyStatus;
  price: string;
  location: string;
  agent?: Agent;
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
};

export type UpdatePropertyRequest = {
  title?: string;
  description?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  price?: number;
  location?: string;
};
