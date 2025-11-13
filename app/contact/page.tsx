"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Building2, AlertTriangle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#050b16] text-slate-100">
      <Header />

      <main className="px-4 py-16 sm:py-20">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">Contact Us</h1>
          <p className="mt-3 text-base text-slate-300 sm:text-lg">
            We're here to help. Reach out for support, product questions, or feedback.
          </p>
        </section>

        <section className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
            <Mail className="mx-auto h-8 w-8 text-emerald-300" />
            <h2 className="mt-4 text-lg font-semibold text-white">Email</h2>
            <p className="mt-2 text-sm text-slate-300">For support and inquiries</p>
            <Button
              asChild
              variant="outline"
              className="mt-4 w-full rounded-2xl border-white/20 bg-white/10 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/15"
            >
              <Link href="mailto:telecheckaustralia@gmail.com">telecheckaustralia@gmail.com</Link>
            </Button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
            <Building2 className="mx-auto h-8 w-8 text-blue-300" />
            <h2 className="mt-4 text-lg font-semibold text-white">Business Details</h2>
            <p className="mt-2 text-sm text-slate-300">Justin Black</p>
            <p className="text-sm text-slate-300">ABN: 12048148174</p>
            <p className="mt-1 text-sm text-slate-300">Australia</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur">
            <AlertTriangle className="mx-auto h-8 w-8 text-amber-300" />
            <h2 className="mt-4 text-lg font-semibold text-white">Emergency</h2>
            <p className="mt-2 text-sm text-slate-300">
              For medical emergencies, call 000 immediately.
            </p>
            <p className="mt-1 text-sm text-slate-300">
              TeleCheck is not for emergency situations.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Support Hours</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-white">Technical Support</p>
              <p className="mt-1 text-sm text-slate-300">Available through the members dashboard.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Response Time</p>
              <p className="mt-1 text-sm text-slate-300">We aim to respond within 24–48 hours.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Professional Support</p>
              <p className="mt-1 text-sm text-slate-300">Handled by qualified healthcare professionals.</p>
            </div>
          </div>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            TeleCheck provides information only and does not replace professional medical advice. Always consult qualified
            healthcare professionals for medical decisions.
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
