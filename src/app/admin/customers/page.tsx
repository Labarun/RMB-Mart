import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, ShoppingBag, Calendar, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      _count: {
        select: { orders: true },
      },
    },
  });

  const totalCustomers = customers.length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-white">Customers</h1>
          <p className="text-slate-400 mt-1">
            {totalCustomers} registered customer{totalCustomers !== 1 ? "s" : ""}
          </p>
        </div>
        <Card className="border-none bg-emerald-950/50 shadow-none">
          <CardContent className="flex items-center gap-3 py-3 px-4">
            <Users className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold text-white font-heading">{totalCustomers}</p>
              <p className="text-xs text-slate-400">Total Users</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {customers.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-700 bg-transparent shadow-none">
          <CardContent className="flex flex-col items-center justify-center h-48 text-center">
            <Users className="w-10 h-10 text-slate-600 mb-4" />
            <p className="font-medium text-slate-300">No customers yet</p>
            <p className="text-sm text-slate-500">Customers will appear here once they register.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 bg-slate-900/80 uppercase border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium text-center">Orders</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-alipay/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-alipay">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-white">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-slate-300 flex items-center gap-1.5 text-xs">
                          <Mail className="w-3 h-3 text-slate-500" /> {customer.email}
                        </p>
                        {customer.phone && (
                          <p className="text-slate-400 flex items-center gap-1.5 text-xs">
                            <Phone className="w-3 h-3 text-slate-500" /> {customer.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-400 flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3 h-3" />
                        {format(customer.createdAt, "MMM d, yyyy")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-alipay/10 text-alipay">
                        <ShoppingBag className="w-3 h-3" />
                        {customer._count.orders}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin?customer=${customer.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-white hover:bg-slate-800">
                          View Orders
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
