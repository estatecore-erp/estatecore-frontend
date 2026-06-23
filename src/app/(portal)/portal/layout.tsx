import PortalNavbar from "@/components/layout/PortalNavbar";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PortalNavbar />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
