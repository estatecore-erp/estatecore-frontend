"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  MessageSquare,
  FileText,
  DollarSign,
} from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";

import LogoMain from "@/../public/logo.svg";
import LogoWide from "@/../public/logo-wide.svg";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/properties", label: "Properties", icon: Building2 },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/employees", label: "Employees", icon: UserCheck },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/dashboard/leases", label: "Leases", icon: FileText },
  { href: "/dashboard/sales", label: "Sales", icon: DollarSign },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-2">
        <div
          className={cn(
            "flex items-center",
            open ? "justify-start px-2" : "justify-center",
          )}
        >
          {open ? (
            <Image src={LogoWide} alt="EstateCore" height={32} priority />
          ) : (
            <Image src={LogoMain} alt="EC" width={32} height={32} priority />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;