import { Property } from './property';
import { User } from './auth';

export type Sale = {
  id: number;
  property: Property;
  client: User;
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
