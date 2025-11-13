"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import PatientEligibilityChecker from "@/components/PatientEligibilityChecker";
import { AlertTriangle, Users, Shield } from "lucide-react";

export default function CheckEligibilityPage() {
  return (
    <div className="min-h-screen bg-[#050b16] text-slate-100">
      <Header />

      <main className="px-4 py-16 sm:py-20">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">For Patients</h1>
          <p className="mt-3 text-base text-slate-300 sm:text-lg">
            Medicare telehealth disaster exemption guidance
          </p>
          <p className="mt-4 text-sm text-slate-300 sm:text-base">
            This tool provides general guidance only. Your GP, Nurse Practitioner, or Midwife determines final eligibility based
            on clinical assessment, their clinic's billing structure, and Medicare requirements.
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-5xl grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <Users className="h-7 w-7 text-sky-300" />
            <h2 className="mt-4 text-lg font-semibold text-white">Your practitioner makes the final decision</h2>
            <p className="mt-3 text-sm text-slate-300">
              TeleCheck provides official disaster data so you and your practitioner can discuss Medicare rebate options with
              confidence.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <Shield className="h-7 w-7 text-emerald-300" />
            <h2 className="mt-4 text-lg font-semibold text-white">Why TeleCheck?</h2>
            <p className="mt-3 text-sm text-slate-300">
              Medicare has several telehealth exemptions. TeleCheck focuses on the natural disaster exemption—the one that changes
              daily and requires government verification.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-4xl rounded-3xl border border-amber-400/30 bg-amber-400/10 p-6 text-sm text-amber-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6" />
            <div>
              <h2 className="text-base font-semibold text-white">Important update</h2>
              <p className="mt-2 text-amber-100/90">
                From 1 November 2025, nurse practitioners follow the same 12-month established relationship requirement as GPs. The
                exemptions below remain unchanged.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-4xl space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Exemptions that bypass the 12-month rule</h2>
            <ul className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
              <li>• Children under 12 months</li>
              <li>• People who are homeless</li>
              <li>• Patients of AMS/ACCHS services</li>
              <li>• COVID-19 isolation / quarantine</li>
              <li>• Living in a declared natural disaster area</li>
              <li>• Blood borne virus & sexual or reproductive health consultations</li>
            </ul>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h2 className="text-xl font-semibold text-white sm:text-2xl text-center">
            Check your postcode for natural disaster exemptions
          </h2>
          <p className="mt-3 text-center text-sm text-slate-300 sm:text-base">
            Enter your postcode below to see if your area currently qualifies for Medicare telehealth rebates due to disaster
            declarations.
          </p>
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
            <PatientEligibilityChecker />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
