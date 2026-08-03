import { UserPlus, CreditCard, Zap } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description: "Sign up in seconds with your email. No lengthy verification process.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: CreditCard,
    step: "02",
    title: "Pay in GHS",
    description: "Select your RMB amount and pay via Mobile Money. Upload your payment receipt.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: Zap,
    step: "03",
    title: "Receive RMB",
    description: "We transfer the RMB directly to your Alipay or WeChat Pay account. Done!",
    color: "from-amber-500 to-amber-600",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-alipay/10 text-alipay">
            Simple Process
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            Exchange your GHS for RMB in three easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-amber-200 dark:from-blue-900 dark:via-emerald-900 dark:to-amber-900" />

          {steps.map((step, index) => (
            <div
              key={step.step}
              className="relative flex flex-col items-center text-center space-y-6 opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s`, animationFillMode: "forwards" }}
            >
              {/* Step Number Circle */}
              <div className="relative z-10">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                  <step.icon className="w-9 h-9 text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm">
                  {step.step}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-heading text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
