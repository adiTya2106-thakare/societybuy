import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";

export default async function DeliveryLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;

  if (!session?.user) redirect("/login");
  if (role !== "DELIVERY_PARTNER" && role !== "PLATFORM_ADMIN") redirect("/app");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 shrink-0 border-r bg-white hidden lg:flex flex-col">
        <div className="flex h-16 items-center border-b px-4 font-bold text-blue-700">
          🚚 Delivery Portal
        </div>
        <nav className="flex-1 p-3">
          {[
            { href: "/delivery", label: "My Deliveries" },
            { href: "/delivery/history", label: "History" },
            { href: "/delivery/earnings", label: "Earnings" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">{children}</div>
      </main>
    </div>
  );
}
