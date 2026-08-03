"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, DollarSign, ShoppingCart, RefreshCcw, XCircle, BarChart3 } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AnalyticsData {
  summary: {
    totalVolumeGhs: number;
    totalVolumeRmb: number;
    totalOrdersCount: number;
    completedOrdersCount: number;
    pendingOrdersCount: number;
    cancelledOrdersCount: number;
  };
  chartData: {
    date: string;
    ghsVolume: number;
    orders: number;
  }[];
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"7" | "30" | "all">("all");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/analytics?period=${period}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, [period]);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-alipay" />
            Platform Analytics
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Monitor platform performance, exchange volume, and order statuses.
          </p>
        </div>

        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <Button
            variant={period === "7" ? "default" : "ghost"}
            size="sm"
            onClick={() => setPeriod("7")}
            className={period === "7" ? "clay-button" : "text-slate-600 dark:text-slate-400"}
          >
            7 Days
          </Button>
          <Button
            variant={period === "30" ? "default" : "ghost"}
            size="sm"
            onClick={() => setPeriod("30")}
            className={period === "30" ? "clay-button" : "text-slate-600 dark:text-slate-400"}
          >
            30 Days
          </Button>
          <Button
            variant={period === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setPeriod("all")}
            className={period === "all" ? "clay-button" : "text-slate-600 dark:text-slate-400"}
          >
            All Time
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-alipay" />
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="clay">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total GHS Exchanged</CardTitle>
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-heading">{formatCurrency(data.summary.totalVolumeGhs, "GHS")}</div>
                <p className="text-xs text-slate-500 mt-1">Completed orders only</p>
              </CardContent>
            </Card>

            <Card className="clay">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total RMB Disbursed</CardTitle>
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-heading">{formatCurrency(data.summary.totalVolumeRmb, "CNY")}</div>
                <p className="text-xs text-slate-500 mt-1">Successfully fulfilled</p>
              </CardContent>
            </Card>

            <Card className="clay">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Orders</CardTitle>
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-heading">{data.summary.totalOrdersCount}</div>
                <p className="text-xs text-slate-500 mt-1">Across all statuses</p>
              </CardContent>
            </Card>

            <Card className="clay">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed Orders</CardTitle>
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-heading">{data.summary.completedOrdersCount}</div>
              </CardContent>
            </Card>

            <Card className="clay">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">In Progress</CardTitle>
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <RefreshCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-heading">{data.summary.pendingOrdersCount}</div>
              </CardContent>
            </Card>

            <Card className="clay">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Cancelled / Refunded</CardTitle>
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-heading">{data.summary.cancelledOrdersCount}</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="clay">
              <CardHeader>
                <CardTitle>GHS Volume Trend</CardTitle>
                <CardDescription>Daily volume of completed orders ({period === "all" ? "Last 30 Days" : `Last ${period} Days`})</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorGhs" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1677FF" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#1677FF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" stroke="#8B9BB5" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#8B9BB5" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₵${value}`} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value: any) => [formatCurrency(value, "GHS"), "Volume"]}
                      />
                      <Area type="monotone" dataKey="ghsVolume" stroke="#1677FF" strokeWidth={3} fillOpacity={1} fill="url(#colorGhs)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="clay">
              <CardHeader>
                <CardTitle>Daily Orders</CardTitle>
                <CardDescription>Number of orders placed ({period === "all" ? "Last 30 Days" : `Last ${period} Days`})</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <XAxis dataKey="date" stroke="#8B9BB5" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#8B9BB5" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                      <Tooltip
                        cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        formatter={(value: any) => [value, "Orders"]}
                      />
                      <Bar dataKey="orders" fill="#13C2C2" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
