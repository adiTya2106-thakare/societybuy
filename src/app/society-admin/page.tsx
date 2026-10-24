import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Home, TrendingDown } from "lucide-react";

export default async function SocietyAdminDashboard() {
  const session = await auth();

  // Find society where user is admin
  const adminMembership = await prisma.societyMembership.findFirst({
    where: { userId: session!.user.id, role: { in: ["ADMIN", "OWNER"] }, status: "APPROVED" },
    include: { society: true },
  });

  if (!adminMembership) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">No society found where you are an admin.</p>
      </div>
    );
  }

  const { society } = adminMembership;

  const [totalMembers, pendingRequests, activeDeals] = await Promise.all([
    prisma.societyMembership.count({ where: { societyId: society.id, status: "APPROVED" } }),
    prisma.societyMembership.count({ where: { societyId: society.id, status: "PENDING" } }),
    prisma.bulkDeal.count({ where: { societyId: society.id, status: { in: ["OPEN", "QUALIFIED"] } } }),
  ]);

  const pendingMemberships = await prisma.societyMembership.findMany({
    where: { societyId: society.id, status: "PENDING" },
    take: 5,
    include: { user: { include: { profile: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{society.name}</h1>
        <p className="text-gray-500">{society.city}, {society.state} — {society.pincode}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-blue-50 p-2"><Users className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Members</p>
              <p className="font-semibold">{totalMembers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-amber-50 p-2"><Users className="h-5 w-5 text-amber-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Pending</p>
              <p className="font-semibold">{pendingRequests}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-green-50 p-2"><TrendingDown className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-xs text-gray-500">Active Deals</p>
              <p className="font-semibold">{activeDeals}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {pendingRequests > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Membership Requests</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {pendingMemberships.map((m: { id: string; flatNumber?: string | null; user: { email: string; profile: { firstName: string; lastName: string } | null } }) => (
              <div key={m.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">
                    {m.user.profile?.firstName} {m.user.profile?.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{m.user.email} • Flat: {m.flatNumber ?? "—"}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 text-xs"
                    asChild
                  >
                    <Link href={`/api/society-admin/memberships/${m.id}/approve`}>Approve</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 text-xs"
                    asChild
                  >
                    <Link href={`/api/society-admin/memberships/${m.id}/reject`}>Reject</Link>
                  </Button>
                </div>
              </div>
            ))}
            {pendingRequests > 5 && (
              <Link href="/society-admin/requests" className="text-sm text-green-600 hover:underline">
                View all {pendingRequests} requests
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
