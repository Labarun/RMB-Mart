"use client";

import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrderTabsProps {
  currentStatus: string;
}

const tabs = [
  { value: "ALL", label: "All Orders" },
  { value: "PENDING", label: "Action Required" },
  { value: "AWAITING_VERIFICATION", label: "Verifying" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
];

export function OrderTabs({ currentStatus }: OrderTabsProps) {
  const router = useRouter();

  function onTabChange(value: string) {
    if (value === "ALL") {
      router.push("/orders");
    } else {
      router.push(`/orders?status=${value}`);
    }
  }

  // Ensure currentStatus matches a tab, otherwise default to ALL (e.g. if REFUNDED/CANCELLED are in URL but not in tabs)
  const activeTab = tabs.find(t => t.value === currentStatus) ? currentStatus : "ALL";

  return (
    <div className="w-full overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="bg-slate-100 dark:bg-slate-900/50 h-11 p-1 inline-flex rounded-xl">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value}
              className="rounded-lg px-5 data-[state=active]:bg-white data-[state=active]:text-alipay data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-alipay-light transition-all"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
