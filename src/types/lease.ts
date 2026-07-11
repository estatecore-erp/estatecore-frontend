import { Property } from './property';
import { User } from './auth';

export type LeaseStatus = "active" | "expired";

export type Lease = {
  id: number;
  property: Property;
  client: User;
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
