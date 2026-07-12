"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import UserNavMenu from "@/components/user/UserNavMenu";
import UserProfileCard from "@/components/user/UserProfileCard";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import LogoWide from "@/../public/logo-wide.svg";

const navItems = [
  { href: "/portal", label: "Browse Properties" },
  { href: "/portal/portfolio", label: "My Portfolio" },
  { href: "/portal/inquiries", label: "My Inquiries" },
];

export default function PortalNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/portal">
          <Image src={LogoWide} alt="EstateCore" height={32} priority />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
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

        <div className="flex items-center gap-2">
          {/* avatar dropdown — desktop only */}
          <div className="hidden md:block">
            <UserNavMenu />
          </div>

          {/* hamburger — mobile only */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 flex flex-col p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle>
                  <Image src={LogoWide} alt="EstateCore" height={28} />
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 p-3 flex-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "text-sm rounded-md px-3 py-2.5 transition-colors",
                      pathname === item.href
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="border-t p-3">
                <UserProfileCard
                  onClick={() => {
                    setOpen(false);
                    router.push("/portal/profile");
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
