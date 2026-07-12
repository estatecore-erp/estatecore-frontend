import { PropertyType, PropertyStatus } from "./property";

export type SaleAgent = {
  id: number;
  name: string;
  email: string;
};

export type SaleProperty = {
  id: number;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  location: string;
  agent: SaleAgent | null;
};

export type SaleClient = {
  id: number;
  name: string;
  email: string;
};

export type Sale = {
  id: number;
  property: SaleProperty;
  client: SaleClient;
  sale_price: number;
  sale_date: string;
  created_at: string;
};

export type StoreSaleRequest = {
  client_id: number;
  property_id: number;
  sale_price: number;
  sale_date: string;
};
