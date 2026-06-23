import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-10 flex h-12 items-center gap-4 border-b bg-background px-4">
      <SidebarTrigger />
      <span className="text-sm font-medium">EstateCore</span>
    </header>
  );
}
