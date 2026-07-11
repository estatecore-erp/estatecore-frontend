import { Property } from "./property";
import { User } from "./auth";

export type InquiryStatus = "pending" | "responded";

export type Inquiry = {
  id: number;
  property: Property;
  client: User;
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
