"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Compass, Users } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Compliance First",
    description: "Ensuring healthcare providers stay compliant with evolving telehealth regulations.",
  },
  {
    icon: Users,
    title: "Patient Care",
    description: "Enabling accessible healthcare during disasters and emergencies.",
  },
  {
    icon: Compass,
    title: "Provider Support",
    description: "Simplifying complex regulations for healthcare professionals across Australia.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050b16] text-slate-100">
      <Header />

      <main className="px-4 py-16 sm:py-20">
        <section className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">About TeleCheck</h1>
          <p className="mt-3 text-base text-slate-300 sm:text-lg">
            Empowering Australian healthcare providers with reliable telehealth compliance tools.
          </p>
          <p className="mt-4 text-sm text-slate-300 sm:text-base">
            TeleCheck was founded to address the growing complexity of Medicare telehealth regulations. During disasters and
            emergencies, healthcare providers need quick, reliable verification of telehealth eligibility to serve patients
            effectively.
          </p>
          <p className="mt-4 text-sm text-slate-300 sm:text-base">
            We believe that compliance shouldn't be a barrier to patient care. Our platform simplifies the verification
            process, allowing healthcare providers to focus on delivering quality care to their patients.
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <Icon className="h-8 w-8 text-amber-300" />
                <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-4xl text-center">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Supporting telehealth and mixed clinics Australia-wide</h2>
          <p className="mt-4 text-sm text-slate-300 sm:text-base">
            We support practices across every state and territory with reliable compliance tools — no vanity numbers, just
            nationwide support.
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
          <h3 className="text-xl font-semibold text-white">Trusted by Healthcare Professionals</h3>
          <p className="mt-3 text-sm text-slate-300 sm:text-base">
            TeleCheck is built by healthcare technology experts who understand the unique challenges of Australian healthcare
            delivery. We're committed to maintaining the highest standards of accuracy, security, and reliability in all our
            services.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
