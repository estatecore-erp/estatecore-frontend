import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/AppSidebar";
import DashboardNavbar from "@/components/layout/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <DashboardNavbar />
        <main className="flex-1 p-4 sm:p-6 bg-background overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
