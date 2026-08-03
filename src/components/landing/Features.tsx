import {
  Shield,
  Zap,
  Globe,
  Clock,
  Smartphone,
  BadgeCheck,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fast Processing",
    description:
      "Your RMB is sent to Alipay or WeChat within hours of payment confirmation.",
    color: "var(--alipay-blue)",
    bgColor: "rgba(22, 119, 255, 0.08)",
  },
  {
    icon: Shield,
    title: "Secure & Transparent",
    description:
      "Every transaction is tracked with a unique order ID. Know your status in real-time.",
    color: "var(--alipay-teal)",
    bgColor: "rgba(19, 194, 194, 0.08)",
  },
  {
    icon: Globe,
    title: "Competitive Rates",
    description:
      "We offer some of the best GHS to RMB rates in the market, updated daily.",
    color: "var(--alipay-success)",
    bgColor: "rgba(82, 196, 26, 0.08)",
  },
  {
    icon: Smartphone,
    title: "Alipay & WeChat Pay",
    description:
      "Direct transfers to your Alipay or WeChat Pay account. No middleman needed.",
    color: "var(--alipay-blue)",
    bgColor: "rgba(22, 119, 255, 0.08)",
  },
  {
    icon: Clock,
    title: "Order Tracking",
    description:
      "Monitor your exchange from placement to completion on your personal dashboard.",
    color: "var(--alipay-warning)",
    bgColor: "rgba(250, 173, 20, 0.08)",
  },
  {
    icon: BadgeCheck,
    title: "Trusted Platform",
    description:
      "Built for the Ghanaian community with dedicated support and reliable service.",
    color: "var(--alipay-teal)",
    bgColor: "rgba(19, 194, 194, 0.08)",
  },
];

export default function Features() {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            Why Choose RMBmart?
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            A platform designed specifically for Ghanaians sending money to
            China.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="clay p-6 space-y-4 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: feature.bgColor }}
              >
                <feature.icon
                  className="w-6 h-6"
                  style={{ color: feature.color }}
                />
              </div>
              <h3 className="font-heading text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
