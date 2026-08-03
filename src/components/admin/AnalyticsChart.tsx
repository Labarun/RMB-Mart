"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO, subDays } from "date-fns";

interface ChartDataPoint {
  date: string;
  volumeRmb: number;
  volumeGhs: number;
}

interface AnalyticsChartProps {
  orders: {
    amountRmb: number;
    amountGhs: number;
    createdAt: Date;
  }[];
}

export function AnalyticsChart({ orders }: AnalyticsChartProps) {
  const chartData = useMemo(() => {
    // Generate an array of the last 30 days
    const days: Record<string, ChartDataPoint> = {};
    for (let i = 29; i >= 0; i--) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      days[date] = { date, volumeRmb: 0, volumeGhs: 0 };
    }

    // Aggregate order data
    orders.forEach((order) => {
      const dateStr = format(new Date(order.createdAt), "yyyy-MM-dd");
      if (days[dateStr]) {
        days[dateStr].volumeRmb += order.amountRmb;
        days[dateStr].volumeGhs += order.amountGhs;
      }
    });

    return Object.values(days).map((d) => ({
      ...d,
      displayDate: format(parseISO(d.date), "MMM d"),
    }));
  }, [orders]);

  if (orders.length === 0) {
    return null;
  }

  return (
    <Card className="clay-card border-none bg-white dark:bg-slate-950 col-span-full">
      <CardHeader>
        <CardTitle>Transaction Volume (Last 30 Days)</CardTitle>
        <CardDescription>Daily completed exchange volume in RMB</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRmb" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis 
                dataKey="displayDate" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "#64748b" }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) => `¥${value.toLocaleString()}`}
                width={80}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg shadow-xl">
                        <p className="font-medium mb-2">{payload[0].payload.displayDate}</p>
                        <div className="space-y-1">
                          <p className="text-emerald-500 text-sm font-semibold">
                            RMB: ¥{payload[0].payload.volumeRmb.toLocaleString()}
                          </p>
                          <p className="text-slate-500 text-sm font-medium">
                            GHS: GH₵{payload[0].payload.volumeGhs.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="volumeRmb"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRmb)"
                activeDot={{ r: 6, strokeWidth: 0, fill: "#10b981" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
