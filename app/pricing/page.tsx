"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const individualFeatures = [
  "Unlimited disaster verifications",
  "Clinic analysis (up to 10,000 patient postcodes)",
  "Real-time Medicare compliance",
  "Full audit trail logging",
  "Email support",
];

const apiFeatures = [
  "RESTful API access with authentication",
  "Integrate into your software, website, or dashboard",
  "Unlimited API calls",
  "Comprehensive documentation & guides",
  "Usage analytics & logging",
  "Priority email support",
];

const faqs = [
  {
    question: "Who is the Individual subscription for?",
    answer:
      "Individual ($27.05 AUD/month) is designed for ONE INDIVIDUAL PRACTITIONER or ONE CLINIC with ONE PRACTITIONER. You get unlimited disaster verifications, clinic analysis for up to 10,000 patient postcodes, and full audit trails. Each postcode represents one patient's address with no deduplication.",
  },
  {
    question: "Is there a limit on API calls?",
    answer:
      "No, API Access includes unlimited API calls. We enforce fair use policies to prevent abuse, but there's no monthly cap on requests. Perfect for high-volume integrations.",
  },
  {
    question: "What's included in the 1-day free trial?",
    answer:
      "Your 1-day free trial gives you full access to all TeleCheck Professional features including unlimited disaster verifications, clinic analysis for up to 10,000 patient postcodes, and all compliance tools. No credit card required to start your trial. After 24 hours, your subscription automatically begins at $27.05/month (including GST) unless you cancel.",
  },
  {
    question: "Is API Access available?",
    answer:
      "API Access is currently in development and not yet available for subscription. We're building comprehensive integration guides for popular EMR systems and ensuring enterprise-grade security, monitoring, and team management features. Join the waitlist to be notified when it launches and help us understand your specific integration needs.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#050b16] text-slate-100">
      <Header />

      <main className="px-4 pb-20 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
            Simple, Transparent Pricing
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Individual access for practitioners or API integration for organisations – we've got you covered.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/0" />
            <div className="relative space-y-5">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-emerald-400/60 bg-emerald-400/15 text-emerald-100">
                  Live Now
                </Badge>
                <span className="text-sm font-semibold uppercase tracking-wide text-white/70">
                  Individual Plan
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-white">Individual</h2>
              <p className="text-sm text-slate-300">For individual practitioners</p>
              <div className="text-4xl font-bold text-white">
                $27.05 <span className="text-lg font-medium text-white/70">/month</span>
              </div>
              <p className="text-sm text-emerald-300">✨ Includes 1-Day Free Trial</p>

              <ul className="space-y-3 text-sm text-slate-200">
                {individualFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center text-sm text-slate-200">
                Start your 1-day free trial • No credit card required
              </div>

              <Button
                data-o-anonymous
                data-o-auth="1"
                data-mode="popup"
                data-widget-mode="register"
                data-plan-uid="pWrbAMWn"
                data-skip-plan-options="true"
                className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 py-3 text-base font-semibold shadow-lg shadow-red-500/25 hover:from-rose-400 hover:to-red-400"
              >
                Start FREE Trial
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/0" />
            <div className="relative space-y-5">
              <Badge variant="outline" className="border-amber-400/60 bg-amber-400/15 text-amber-100">
                Coming Soon
              </Badge>
              <h2 className="text-2xl font-semibold text-white">API Access</h2>
              <p className="text-sm text-slate-300">
                Join the waitlist to be notified when it launches
              </p>
              <div className="text-4xl font-bold text-white">
                $299 <span className="text-lg font-medium text-white/70">/month</span>
              </div>
              <p className="text-sm text-white/70">Unlimited Users</p>

              <ul className="space-y-3 text-sm text-slate-200">
                {apiFeatures.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-amber-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-200">
                <p className="font-semibold">🚧 API Access is currently in development</p>
                <p className="mt-2 text-slate-300">
                  Join the waitlist to be notified when it launches and help us understand your integration needs.
                </p>
              </div>

              <Button
                asChild
                variant="outline"
                className="w-full rounded-2xl border-white/20 bg-white/5 py-3 text-base font-semibold text-white hover:border-white/40 hover:bg-white/10"
              >
                <Link href="mailto:support@telecheck.com.au?subject=TeleCheck%20API%20Waitlist">
                  Join Waitlist
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <section className="mx-auto mt-20 max-w-5xl space-y-10">
          <h2 className="text-center text-3xl font-semibold text-white sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8 text-left text-sm text-slate-200 sm:text-base">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h3 className="text-lg font-semibold text-white">
                  {faq.question}
                </h3>
                <p className="mt-3 text-slate-200/90 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
