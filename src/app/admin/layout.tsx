import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;

  if (!session?.user) redirect("/login");
  if (role !== "PLATFORM_ADMIN") redirect("/app");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 shrink-0 border-r bg-white hidden lg:flex flex-col">
        <div className="flex h-16 items-center border-b px-4 font-bold text-red-700">
          ⚡ Admin Portal
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          {[
            { href: "/admin", label: "Overview" },
            { href: "/admin/users", label: "Users" },
            { href: "/admin/societies", label: "Societies" },
            { href: "/admin/merchants", label: "Merchants" },
            { href: "/admin/products", label: "Products" },
            { href: "/admin/orders", label: "Orders" },
            { href: "/admin/deals", label: "Bulk Deals" },
            { href: "/admin/payments", label: "Payments" },
            { href: "/admin/refunds", label: "Refunds" },
            { href: "/admin/support", label: "Support" },
            { href: "/admin/audit", label: "Audit Logs" },
            { href: "/admin/settings", label: "Settings" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
