import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OrderForm } from "@/components/orders/OrderForm";

export default async function NewOrderPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Fetch the latest exchange rate
  const latestRate = await prisma.exchangeRate.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  const currentRate = latestRate?.rateGhsToRmb || 1.95; // Fallback just in case

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold tracking-tight">Place an Order</h1>
        <p className="text-muted-foreground mt-2">Create a new exchange request to top up your Alipay or WeChat Pay account.</p>
      </div>

      <OrderForm currentRate={currentRate} />
    </div>
  );
}
