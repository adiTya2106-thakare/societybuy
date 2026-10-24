import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";

export default async function SocietyAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;

  if (!session?.user) redirect("/login");
  if (role !== "SOCIETY_ADMIN" && role !== "PLATFORM_ADMIN") redirect("/app");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-60 shrink-0 border-r bg-white hidden lg:flex flex-col">
        <div className="flex h-16 items-center border-b px-4 font-bold text-indigo-700">
          🏘️ Society Admin
        </div>
        <nav className="flex-1 p-3">
          {[
            { href: "/society-admin", label: "Dashboard" },
            { href: "/society-admin/members", label: "Members" },
            { href: "/society-admin/requests", label: "Join Requests" },
            { href: "/society-admin/deals", label: "Deals" },
            { href: "/society-admin/delivery", label: "Delivery Points" },
            { href: "/society-admin/announcements", label: "Announcements" },
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
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
