import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main
          className="flex-1 p-6 relative"
          style={{
            backgroundImage:
              "radial-gradient(circle, #e5e5e5 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
