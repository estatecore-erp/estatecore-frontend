"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/auth/LogoutButton";

import LogoWide from "@/../public/logo-wide.svg";

const navItems = [
  { href: "/portal", label: "Properties" },
  { href: "/portal/inquiries", label: "My Inquiries" },
];

export default function PortalNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/portal">
          <Image src={LogoWide} alt="EstateCore" height={32} priority />
        </Link>

        {/* Nav Items */}
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm transition-colors",
                pathname === item.href
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <LogoutButton />
      </div>
    </header>
  );
}
