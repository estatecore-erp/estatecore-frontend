import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { inter } from "@/utils/fonts";
import AuthInitializer from "@/components/auth/AuthInitializer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "EstateCore",
  description: "Real Estate ERP System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans", inter.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen">
        <TooltipProvider>
          <AuthInitializer />
          <Toaster position="bottom-right" reverseOrder={false} />
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
