import { PropertyType, PropertyStatus } from "./property";

export type InquiryStatus = "pending" | "responded";

export type InquiryClient = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
};

export type InquiryAgent = {
  id: number;
  name: string;
  email: string;
};

export type InquiryProperty = {
  id: number;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  location: string;
  agent: InquiryAgent | null;
};

export type Inquiry = {
  id: number;
  property: InquiryProperty;
  client: InquiryClient;
  message: string;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
};

export type StoreInquiryRequest = {
  property_id: number;
  message: string;
};

export type UpdateInquiryRequest = {
  status: InquiryStatus;
};
