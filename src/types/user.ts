import { User } from "./auth";

export type Employee = {
  id: number;
  user: User;
  hire_date: string;
  created_at: string;
};

export type Client = {
  id: number;
  user: User;
  created_at: string;
};

export type UpdateEmployeeRequest = {
  name?: string;
  phone?: string;
};

export type UpdateClientRequest = {
  name?: string;
  phone?: string;
  address?: string;
};
