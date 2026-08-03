"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How long does an exchange take?",
    answer:
      "Most exchanges are completed within 1–4 hours after we confirm your GHS payment. During peak times, it may take up to 12 hours.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We currently accept Mobile Money (MoMo) transfers. We support all major networks including MTN, Vodafone Cash, and AirtelTigo Money.",
  },
  {
    question: "Is there a minimum or maximum exchange amount?",
    answer:
      "The minimum exchange is ¥50 RMB. There is no hard maximum, but for exchanges over ¥10,000 RMB, please contact us first for the best rates.",
  },
  {
    question: "How do I receive my RMB?",
    answer:
      "We transfer the RMB directly to your Alipay or WeChat Pay account. You just need to provide your account name and ID (or scan QR code) when placing the order.",
  },
  {
    question: "What exchange rate do you use?",
    answer:
      "We offer competitive daily rates that are updated regularly. The exact rate is locked at the time you place your order, so you always know what you'll receive.",
  },
  {
    question: "Can I cancel or get a refund?",
    answer:
      "You can request a cancellation if your order is still in 'Pending' status. Once processing begins, cancellations are handled on a case-by-case basis. Contact our support team for help.",
  },
  {
    question: "Is my information secure?",
    answer:
      "Absolutely. All data is encrypted in transit and at rest. We never share your personal or financial information with third parties.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-medium text-slate-900 dark:text-white group-hover:text-alipay transition-colors pr-4">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-alipay/10 text-alipay">
            FAQ
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            Everything you need to know about using RMBmart.
          </p>
        </div>

        <div className="clay p-2 sm:p-6">
          {faqs.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
