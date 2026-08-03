import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, endOfDay, format } from "date-fns";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all"; // '7', '30', 'all'

    // Determine date range filter
    let dateFilter = {};
    const now = new Date();
    let daysToFetch = 7;

    if (period === "7") {
      daysToFetch = 7;
      dateFilter = {
        createdAt: {
          gte: startOfDay(subDays(now, 6)),
        },
      };
    } else if (period === "30") {
      daysToFetch = 30;
      dateFilter = {
        createdAt: {
          gte: startOfDay(subDays(now, 29)),
        },
      };
    } else {
      daysToFetch = 30; // For "all time", we still limit the chart to the last 30 days to avoid massive payloads
    }

    // 1. Fetch Aggregated Totals (Based on selected period for accuracy, or all time)
    const aggregatedOrders = await prisma.order.findMany({
      where: period !== "all" ? dateFilter : undefined,
      select: {
        status: true,
        amountGhs: true,
        amountRmb: true,
        createdAt: true,
      },
    });

    let totalVolumeGhs = 0;
    let totalVolumeRmb = 0;
    let completedOrdersCount = 0;
    let pendingOrdersCount = 0;
    let cancelledOrdersCount = 0;

    aggregatedOrders.forEach((order) => {
      if (order.status === "COMPLETED") {
        totalVolumeGhs += order.amountGhs;
        totalVolumeRmb += order.amountRmb;
        completedOrdersCount++;
      } else if (order.status === "PENDING" || order.status === "AWAITING_VERIFICATION" || order.status === "PROCESSING") {
        pendingOrdersCount++;
      } else if (order.status === "CANCELLED" || order.status === "REFUNDED") {
        cancelledOrdersCount++;
      }
    });

    const totalOrdersCount = aggregatedOrders.length;

    // 2. Prepare Chart Data (Daily volume over the past `daysToFetch` days)
    const chartDataMap = new Map<string, { date: string; ghsVolume: number; orders: number }>();
    
    // Initialize map with empty days so the chart shows flat lines for days with no orders
    for (let i = daysToFetch - 1; i >= 0; i--) {
      const dateStr = format(subDays(now, i), "MMM dd");
      chartDataMap.set(dateStr, { date: dateStr, ghsVolume: 0, orders: 0 });
    }

    // Only process orders within the chart window
    const chartWindowFilter = {
      createdAt: {
        gte: startOfDay(subDays(now, daysToFetch - 1)),
      },
    };

    const recentOrders = period !== "all" ? aggregatedOrders : await prisma.order.findMany({
      where: chartWindowFilter,
      select: {
        status: true,
        amountGhs: true,
        createdAt: true,
      },
    });

    recentOrders.forEach((order) => {
      // We only count COMPLETED volume for the financial chart, but we can count total orders for activity
      const dateStr = format(order.createdAt, "MMM dd");
      if (chartDataMap.has(dateStr)) {
        const current = chartDataMap.get(dateStr)!;
        current.orders += 1;
        if (order.status === "COMPLETED") {
          current.ghsVolume += order.amountGhs;
        }
      }
    });

    const chartData = Array.from(chartDataMap.values());

    return NextResponse.json({
      summary: {
        totalVolumeGhs,
        totalVolumeRmb,
        totalOrdersCount,
        completedOrdersCount,
        pendingOrdersCount,
        cancelledOrdersCount,
      },
      chartData,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
