export type PropertyStats = {
  total: number;
  available: number;
  rented: number;
  sold: number;
};

export type MonthlySales = {
  month: string;
  total: number;
};

export type RecentActivity = {
  type: "sale" | "lease" | "inquiry";
  message: string;
  created_at: string;
};

export type DashboardStats = {
  properties: PropertyStats;
  leases_active: number;
  sales_this_month: number;
  inquiries_pending: number;
  clients_total: number;
  monthly_sales: MonthlySales[];
  property_status_breakdown: {
    available: number;
    rented: number;
    sold: number;
  };
  recent_activity: RecentActivity[];
};
