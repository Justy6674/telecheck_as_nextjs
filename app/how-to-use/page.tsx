"use client";

import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const steps = [
  {
    title: "Quick Postcode Verification",
    description:
      "Enter, verify, and review postcode eligibility in seconds. Instant disaster status checking with clear compliance guidance for Medicare telehealth services.",
    image: "/hero-images/single-phonebox.webp",
    alt: "TeleCheck postcode verification tool",
  },
  {
    title: "Customisable Clinical Notes",
    description:
      "Create professional notes and cross-reference official government sources. Generate compliant documentation with editable templates and direct links to Medicare guidelines.",
    image: "/hero-images/single-phonebox.webp",
    alt: "TeleCheck clinical note templates",
  },
  {
    title: "Full Clinic Analysis",
    description:
      "Upload patient data and analyse your entire clinic's telehealth eligibility. Get comprehensive reports showing state distribution, remoteness categories, and detailed compliance metrics.",
    image: "/hero-images/single-phonebox.webp",
    alt: "TeleCheck clinic analysis dashboard",
  },
];

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-[#050b16] text-slate-100">
      <Header />

      <main className="px-4 py-16 sm:py-20">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">How TeleCheck Works</h1>
          <p className="mt-3 text-base text-slate-300 sm:text-lg">
            Quick postcode verification, customisable clinical notes, and comprehensive clinic analysis for Medicare telehealth
            disaster exemption compliance.
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-5xl space-y-16">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:grid-cols-2 md:p-10"
            >
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  Step {index + 1}
                </span>
                <h2 className="text-2xl font-semibold text-white sm:text-3xl">{step.title}</h2>
                <p className="text-sm text-slate-300 sm:text-base">{step.description}</p>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  className="object-cover object-center opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#050b16]/60 via-transparent to-transparent" />
              </div>
            </div>
          ))}
        </section>

        <section className="mx-auto mt-16 max-w-3xl text-center">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Ready to Get Started?</h2>
          <p className="mt-3 text-base text-slate-300 sm:text-lg">
            Join healthcare professionals across Australia using TeleCheck for compliant Medicare telehealth services.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
