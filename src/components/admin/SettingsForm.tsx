"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SettingsFormProps {
  initialRate: number;
  initialMomoName: string;
  initialMomoNumber: string;
  initialMomoNetwork: string;
  initialInstructions: string;
  initialAnnouncementText?: string;
  initialAnnouncementEnabled?: boolean;
  initialSupportWhatsapp?: string;
  initialSupportEmail?: string;
}

export function SettingsForm({
  initialRate,
  initialMomoName,
  initialMomoNumber,
  initialMomoNetwork,
  initialInstructions,
  initialAnnouncementText = "",
  initialAnnouncementEnabled = false,
  initialSupportWhatsapp = "",
  initialSupportEmail = "",
}: SettingsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Local state for form fields
  const [rateGhsToRmb, setRateGhsToRmb] = useState(initialRate);
  const [momoName, setMomoName] = useState(initialMomoName);
  const [momoNumber, setMomoNumber] = useState(initialMomoNumber);
  const [momoNetwork, setMomoNetwork] = useState(initialMomoNetwork);
  const [instructions, setInstructions] = useState(initialInstructions);

  // Site settings state
  const [announcementText, setAnnouncementText] = useState(initialAnnouncementText);
  const [announcementEnabled, setAnnouncementEnabled] = useState(initialAnnouncementEnabled);
  const [supportWhatsapp, setSupportWhatsapp] = useState(initialSupportWhatsapp);
  const [supportEmail, setSupportEmail] = useState(initialSupportEmail);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rateGhsToRmb: Number(rateGhsToRmb),
          momoName,
          momoNumber,
          momoNetwork,
          instructions,
          announcementText,
          announcementEnabled,
          supportWhatsapp,
          supportEmail,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update settings");
      }

      toast.success("Platform settings updated successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <Card className="clay-card border-none bg-white/50 dark:bg-slate-900/50">
        <CardHeader>
          <CardTitle>Exchange Rate</CardTitle>
          <CardDescription>Set the live exchange rate used for all customer calculations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rateGhsToRmb">1 RMB = X GHS</Label>
            <div className="relative max-w-sm">
              <span className="absolute left-3 top-2.5 text-slate-500 font-medium">GH₵</span>
              <Input 
                id="rateGhsToRmb" 
                type="number" 
                step="0.01" 
                value={rateGhsToRmb}
                onChange={(e) => setRateGhsToRmb(Number(e.target.value))}
                className="pl-10 bg-white dark:bg-slate-950" 
                required
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">E.g., enter 1.95 to charge 1.95 GHS for every 1 RMB.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="clay-card border-none bg-white/50 dark:bg-slate-900/50">
        <CardHeader>
          <CardTitle>Payment Instructions (MoMo)</CardTitle>
          <CardDescription>These details are shown to customers immediately after they place an order.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="momoNetwork">Network</Label>
              <Input 
                id="momoNetwork" 
                value={momoNetwork}
                onChange={(e) => setMomoNetwork(e.target.value)}
                className="bg-white dark:bg-slate-950" 
                placeholder="E.g., MTN, Vodafone"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="momoNumber">Account Number / Till</Label>
              <Input 
                id="momoNumber" 
                value={momoNumber}
                onChange={(e) => setMomoNumber(e.target.value)}
                className="bg-white dark:bg-slate-950" 
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="momoName">Account Name</Label>
            <Input 
              id="momoName" 
              value={momoName}
              onChange={(e) => setMomoName(e.target.value)}
              className="bg-white dark:bg-slate-950 max-w-md" 
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Additional Instructions</Label>
            <Textarea 
              id="instructions" 
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="bg-white dark:bg-slate-950 resize-none h-24" 
              placeholder="E.g., Please use your Order ID as the reference..."
            />
          </div>
        </CardContent>
      </Card>

      <Card className="clay-card border-none bg-white/50 dark:bg-slate-900/50">
        <CardHeader>
          <CardTitle>Site Announcement & Support Contact</CardTitle>
          <CardDescription>Update live header banners and support contact details across the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              id="announcementEnabled"
              type="checkbox"
              checked={announcementEnabled}
              onChange={(e) => setAnnouncementEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="announcementEnabled" className="font-semibold cursor-pointer">
              Enable Top Announcement Banner
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="announcementText">Announcement Text</Label>
            <Input
              id="announcementText"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="bg-white dark:bg-slate-950"
              placeholder="E.g., Operating Hours: 8:00 AM - 10:00 PM GMT | Instant Alipay & WeChat payouts!"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supportWhatsapp">Support WhatsApp</Label>
              <Input
                id="supportWhatsapp"
                value={supportWhatsapp}
                onChange={(e) => setSupportWhatsapp(e.target.value)}
                className="bg-white dark:bg-slate-950"
                placeholder="+233 XX XXX XXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="bg-white dark:bg-slate-950"
                placeholder="support@rmbmart.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="clay-button w-full md:w-auto min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save All Settings"
          )}
        </Button>
      </div>
    </form>
  );
}
