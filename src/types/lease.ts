import { PropertyType, PropertyStatus } from "./property";

export type LeaseStatus = "active" | "expired";

export type LeaseAgent = {
  id: number;
  name: string;
  email: string;
};

export type LeaseProperty = {
  id: number;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  location: string;
  agent: LeaseAgent | null;
};

export type LeaseClient = {
  id: number;
  name: string;
  email: string;
};

export type Lease = {
  id: number;
  property: LeaseProperty;
  client: LeaseClient;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  status: LeaseStatus;
  created_at: string;
};

export type StoreLeaseRequest = {
  client_id: number;
  property_id: number;
  start_date: string;
  end_date: string;
  monthly_rent: number;
};

export type UpdateLeaseRequest = {
  status: LeaseStatus;
};
