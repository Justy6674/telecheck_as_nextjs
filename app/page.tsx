"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle2, Shield, Users, Activity } from "lucide-react";

const heroImage = "/hero-images/single-phonebox.webp";

const pillars = [
  {
    label: "WHY",
    description:
      "Medicare requires 12-month in-person visits for telehealth rebates. Natural disaster exemptions change daily based on government declarations.",
  },
  {
    label: "WHAT",
    description:
      "TeleCheck verifies the disaster exemption specifically—the only exemption requiring daily government data verification for audit-ready compliance.",
  },
  {
    label: "HOW",
    description:
      "Instant postcode verification, bulk clinic analysis, AGRN numbers—built for Australian GPs, Nurse Practitioners & Midwives.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#050b16] text-slate-100">
      <Header />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="Classic red phone box in Australia"
              fill
              priority
              className="object-cover object-center opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black via-[#050b16]/80 to-[#0a1425]" />
          </div>

          <div className="relative z-10 px-4 py-24 sm:py-28">
            <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                <Shield className="h-3.5 w-3.5" />
                TeleCheck
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Medicare Telehealth Eligibility Verification
              </h1>
              <p className="mt-6 max-w-2xl text-base text-slate-200 sm:text-lg">
                Natural disaster exemption verification for GPs, Nurse Practitioners, Midwives—and their patients.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  className="group flex flex-col items-center gap-1 rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 px-8 py-4 text-left shadow-lg shadow-red-500/30 transition hover:from-rose-400 hover:to-red-400"
                >
                  <Link href="/pricing">
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
                      For Clinicians
                    </span>
                    <span className="text-lg font-semibold text-white">
                      Subscribe Here
                    </span>
                  </Link>
                </Button>
                <Button
                  asChild
                  className="group flex flex-col items-center gap-1 rounded-2xl border border-white/15 bg-white/10 px-8 py-4 text-left text-white transition hover:border-white/40 hover:bg-white/15"
                >
                  <Link href="/check-eligibility">
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
                      For Patients
                    </span>
                    <span className="text-lg font-semibold text-white">
                      Am I Eligible?
                    </span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-[#061029] py-16">
          <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:grid-cols-3 sm:gap-8">
            {pillars.map((pillar) => (
              <div key={pillar.label} className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300/90">
                  {pillar.label}
                </span>
                <p className="text-sm leading-relaxed text-slate-200">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">Choose Your Path</h2>
            <p className="mt-3 text-base text-slate-300 sm:text-lg">
              Clear pathways for practitioners and patients
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/0" />
              <div className="relative space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                  <Activity className="h-3.5 w-3.5" />
                  For GPs, Nurse Practitioners & Midwives
                </span>
                <p className="text-sm text-slate-200">
                  Verify natural disaster exemptions with bulk analysis, AGRN documentation, and audit-ready compliance reports.
                </p>
                <Link href="/pricing" passHref>
                  <Button className="mt-2 w-full rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 py-3 text-base font-semibold shadow-lg shadow-red-500/25 hover:from-rose-400 hover:to-red-400">
                    Start FREE Trial
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/0" />
              <div className="relative space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                  <Users className="h-3.5 w-3.5" />
                  For Patients
                </span>
                <p className="text-sm text-slate-200">
                  Check if your postcode has a natural disaster exemption that may qualify for Medicare telehealth rebates.
                </p>
                <Link href="/check-eligibility" passHref>
                  <Button className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/20 hover:border-white/40 hover:bg-white/15">
                    Check Your Eligibility
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-[#061029] py-16">
          <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <Shield className="mx-auto h-8 w-8 text-emerald-300" />
              <h3 className="mt-4 text-base font-semibold text-white">DisasterAssist.gov.au verified</h3>
              <p className="mt-2 text-sm text-slate-300">
                Every disaster links directly to official Australian Government sources.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-sky-300" />
              <h3 className="mt-4 text-base font-semibold text-white">Audit-ready compliance</h3>
              <p className="mt-2 text-sm text-slate-300">
                Instant verification, AGRN documentation, and clear audit trails.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <Users className="mx-auto h-8 w-8 text-violet-300" />
              <h3 className="mt-4 text-base font-semibold text-white">Built for practitioners & patients</h3>
              <p className="mt-2 text-sm text-slate-300">
                Shared source of truth that preserves clinical judgment and supports patient care.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
