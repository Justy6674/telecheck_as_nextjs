"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Compass, MessageCircle } from "lucide-react";

const sections = [
  {
    title: "Data Accuracy & Verification",
    description: "Understanding our data sources and how to verify accuracy",
    icon: Shield,
    faqs: [
      {
        question: "How do I verify TeleCheck's disaster data is accurate?",
        answer:
          "Every disaster in TeleCheck links directly to official Australian Government sources. Click 'View on DisasterAssist' next to any disaster to verify accuracy yourself.",
      },
      {
        question: "Why are disasters from years ago still showing as active?",
        answer:
          "State and Territory governments determine when a disaster declaration ends. Many declarations remain active for years during recovery, so TeleCheck keeps them visible until they officially close.",
      },
      {
        question: "How often is TeleCheck's disaster data updated?",
        answer:
          "TeleCheck monitors DisasterAssist and related government feeds daily. Updates are automated 24/7 so practitioners can rely on accurate eligibility information.",
      },
    ],
  },
  {
    title: "Practitioner Control & Clinical Judgement",
    description: "You make the decisions — TeleCheck provides the data",
    icon: Users,
    faqs: [
      {
        question: "Who decides if a patient is eligible — TeleCheck or the practitioner?",
        answer:
          "TeleCheck provides objective disaster data, but the practitioner always makes the final clinical judgement about Medicare eligibility for their patient.",
      },
      {
        question: "What are the 'grey areas' in disaster eligibility?",
        answer:
          "TeleCheck clarifies the objective facts (e.g. disaster status, AGRN numbers). Clinicians interpret grey areas like the impact on continuity of care or patient access barriers.",
      },
      {
        question: "Can I disagree with TeleCheck's data or decide not to use a disaster exemption?",
        answer:
          "Yes. TeleCheck supports compliance, but professional autonomy is preserved. If you decide the exemption isn't appropriate for a patient, you can choose not to use it.",
      },
    ],
  },
  {
    title: "Understanding Australian Disaster Recovery",
    description: "Why disasters remain active for years — it's government policy",
    icon: Compass,
    faqs: [
      {
        question: "Why do some disasters remain active for 5+ years?",
        answer:
          "Government recovery programs often stay open for extended periods to support affected communities. TeleCheck reflects the official status until it changes.",
      },
      {
        question: "Are practitioners exploiting disaster exemptions by billing for old disasters?",
        answer:
          "Disaster declarations are still valid while active. TeleCheck helps practitioners document the objective evidence that the exemption applies when they decide to use it.",
      },
    ],
  },
  {
    title: "Patient & Consumer Questions",
    description: "Understanding your telehealth rights and Medicare eligibility",
    icon: MessageCircle,
    faqs: [
      {
        question: "What is TeleCheck and how can it help me?",
        answer:
          "TeleCheck lets you check whether your postcode is covered by a natural disaster exemption so you can discuss Medicare rebates with your practitioner.",
      },
      {
        question: "Do I need to pay to use TeleCheck as a patient?",
        answer: "No. Patients can check their eligibility for free. Practitioners subscribe for professional compliance tools.",
      },
      {
        question: "How long do disaster declarations last for telehealth purposes?",
        answer:
          "They remain active for as long as the relevant State or Territory keeps the declaration in place. TeleCheck updates daily so you always see the current status.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#050b16] text-slate-100">
      <Header />

      <main className="px-4 py-16 sm:py-20">
        <section className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="border-white/15 bg-white/10 text-white/70">
            Support Centre
          </Badge>
          <h1 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Get answers to common questions about TeleCheck, telehealth compliance, disaster exemptions, and Medicare billing
            requirements for practitioners and patients.
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-5xl space-y-12">
          {sections.map(({ title, description, icon: Icon, faqs }) => (
            <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="flex items-center gap-3">
                <Icon className="h-7 w-7 text-amber-300" />
                <div>
                  <h2 className="text-xl font-semibold text-white sm:text-2xl">{title}</h2>
                  <p className="mt-1 text-sm text-slate-300">{description}</p>
                </div>
              </div>
              <div className="mt-6 space-y-6">
                {faqs.map((faq) => (
                  <div key={faq.question} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <h3 className="text-base font-semibold text-white sm:text-lg">{faq.question}</h3>
                    <p className="mt-2 text-sm text-slate-300 sm:text-base leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="mx-auto mt-16 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Still have questions?</h2>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-6 rounded-2xl border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/15"
          >
            <Link href="mailto:telecheckaustralia@gmail.com">telecheckaustralia@gmail.com</Link>
          </Button>
          <p className="mt-3 text-xs uppercase tracking-wide text-white/60">Response within 24 hours</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
