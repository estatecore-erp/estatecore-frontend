export type Role = "admin" | "agent" | "client";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  address?: string | null;
  hire_date?: string | null;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  address?: string;
};

export type RegisterAgentRequest = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
