import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, ShoppingBag, Calendar, Mail, Phone, ShieldCheck, BadgeCheck, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { RoleUpdateAction } from "@/components/admin/RoleUpdateAction";
import { UserFilter } from "@/components/admin/UserFilter";
import { auth } from "@/lib/auth";

export default async function AdminCustomersPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const session = await auth();
  const searchParams = await props.searchParams;
  
  const roleFilter = searchParams.role;
  const kycFilter = searchParams.kyc;
  
  const whereClause: any = {};
  if (roleFilter === "ADMIN" || roleFilter === "CUSTOMER") {
    whereClause.role = roleFilter;
  }
  if (kycFilter && kycFilter !== "ALL") {
    whereClause.kycStatus = kycFilter;
  }
  
  // Fetch users with filters
  const users = await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      kycStatus: true,
      createdAt: true,
      _count: {
        select: { orders: true },
      },
    },
  });

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === "ADMIN").length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-white">Users & Roles</h1>
          <p className="text-slate-400 mt-1">
            Manage your platform customers and admin staff.
          </p>
          <div className="mt-4">
            <UserFilter />
          </div>
        </div>
        <div className="flex gap-4">
          <Card className="border-none bg-emerald-950/50 shadow-none">
            <CardContent className="flex items-center gap-3 py-3 px-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-white font-heading">{adminCount}</p>
                <p className="text-xs text-slate-400">Admins shown</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none bg-blue-950/50 shadow-none">
            <CardContent className="flex items-center gap-3 py-3 px-4">
              <Users className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white font-heading">{totalUsers}</p>
                <p className="text-xs text-slate-400">Users shown</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {users.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-700 bg-transparent shadow-none">
          <CardContent className="flex flex-col items-center justify-center h-48 text-center">
            <Users className="w-10 h-10 text-slate-600 mb-4" />
            <p className="font-medium text-slate-300">No users found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="bg-slate-950 border-slate-800 shadow-sm hover:border-slate-700 transition-colors">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      user.role === "ADMIN" ? "bg-emerald-500/20 text-emerald-400" : "bg-alipay/10 text-alipay"
                    }`}>
                      <span className="font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-white line-clamp-1">{user.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                          user.role === "ADMIN" ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"
                        }`}>
                          {user.role}
                        </span>
                        
                        {user.kycStatus === "VERIFIED" ? (
                          <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                            <BadgeCheck className="w-3 h-3" />
                            Verified
                          </span>
                        ) : (
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                            user.kycStatus === "PENDING" ? "bg-amber-500/20 text-amber-400" 
                            : user.kycStatus === "REJECTED" ? "bg-red-500/20 text-red-400"
                            : "bg-slate-800 text-slate-400"
                          }`}>
                            {user.kycStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Role Update Action Component */}
                  {session?.user?.id !== user.id && (
                    <RoleUpdateAction userId={user.id} currentRole={user.role} userName={user.name} />
                  )}
                  {session?.user?.id === user.id && (
                    <span className="text-xs text-slate-500 italic flex items-center h-8">You</span>
                  )}
                </div>

                <div className="space-y-2 mb-6">
                  <p className="text-slate-300 flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-slate-500" /> 
                    <span className="truncate">{user.email}</span>
                  </p>
                  {user.phone && (
                    <p className="text-slate-400 flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-slate-500" /> {user.phone}
                    </p>
                  )}
                  <p className="text-slate-400 flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-slate-500" /> 
                    Joined {format(user.createdAt, "MMM d, yyyy")}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800">
                  <span className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-900 text-slate-300">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {user._count.orders} Orders
                  </span>
                  
                  <Link href={`/admin?customer=${user.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 text-alipay hover:text-white hover:bg-alipay">
                      View Orders
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
