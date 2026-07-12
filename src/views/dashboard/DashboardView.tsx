"use client";

import { useEffect, useState } from "react";
import { Building2, FileText, DollarSign, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { DashboardStats, ApiResponse } from "@/types";
import SalesChart from "./SalesChart";

const DashboardView = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((json: ApiResponse<DashboardStats>) => setStats(json.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!stats) {
    return (
      <p className="text-center mt-10 text-muted-foreground">
        Failed to load dashboard stats.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={Building2}
          label="Properties"
          value={stats.properties.total}
          sub={`${stats.properties.available} available`}
        />
        <StatCard
          icon={FileText}
          label="Active leases"
          value={stats.leases_active}
        />
        <StatCard
          icon={DollarSign}
          label="Sales this month"
          value={formatCurrency(stats.sales_this_month)}
        />
        <StatCard
          icon={MessageSquare}
          label="Pending inquiries"
          value={stats.inquiries_pending}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-4">
        {/* monthly sales bar chart */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Sales — last 6 months
            </p>
            <SalesChart data={stats.monthly_sales} />
          </CardContent>
        </Card>

        {/* property status breakdown */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Property status
            </p>
            <div className="space-y-2">
              <StatusRow
                label="Available"
                value={stats.property_status_breakdown.available}
              />
              <StatusRow
                label="Rented"
                value={stats.property_status_breakdown.rented}
              />
              <StatusRow
                label="Sold"
                value={stats.property_status_breakdown.sold}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* recent activity */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-4">Recent activity</p>
          {stats.recent_activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          ) : (
            <div className="space-y-3">
              {stats.recent_activity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm border-b last:border-0 pb-3 last:pb-0"
                >
                  <ActivityIcon type={item.type} />
                  <span className="flex-1">{item.message}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {formatDate(item.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
}) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </CardContent>
  </Card>
);

const StatusRow = ({ label, value }: { label: string; value: number }) => (
  <div className="flex justify-between text-sm">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const ActivityIcon = ({ type }: { type: "sale" | "lease" | "inquiry" }) => {
  const map = {
    sale: DollarSign,
    lease: FileText,
    inquiry: MessageSquare,
  };
  const Icon = map[type];
  return <Icon className="w-4 h-4 text-muted-foreground shrink-0" />;
};

export default DashboardView;
