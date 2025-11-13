"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Shield, BookOpen } from "lucide-react";

const quickCheck = [
  "Children under 12 months",
  "People who are homeless",
  "Patients of AMS/ACCHS services",
  "People isolating due to COVID-19 public health orders",
  "Residents of natural disaster affected areas",
  "Blood borne virus & sexual or reproductive health consultations",
];

const sources = [
  {
    label: "MBS Telehealth Services Factsheet",
    href: "http://www.mbsonline.gov.au/internet/mbsonline/publishing.nsf/Content/Factsheet-TelehealthServices",
  },
  {
    label: "Services Australia – Telehealth",
    href: "https://www.servicesaustralia.gov.au/telehealth-for-health-professionals",
  },
  {
    label: "Department of Health – Telehealth",
    href: "https://www.health.gov.au/our-work/digital-health/telehealth",
  },
  {
    label: "Emergency Health Management",
    href: "https://www.health.gov.au/topics/emergency-health-management/support-after-a-natural-disaster",
  },
];

export default function TelehealthRulesPage() {
  return (
    <div className="min-h-screen bg-[#050b16] text-slate-100">
      <Header />

      <main className="px-4 py-16 sm:py-20">
        <section className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="border-white/15 bg-white/10 text-white/70">
            MBS Compliance Guide
          </Badge>
          <h1 className="mt-6 text-3xl font-semibold text-white sm:text-4xl">Telehealth Rules</h1>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Current Australian Medicare telehealth regulations, established relationship requirements, exemptions, and
            documentation standards for medical practitioners and nurse practitioners.
          </p>
        </section>

        <section className="mx-auto mt-16 max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Exemption Quick Check</h2>
          <p className="mt-2 text-sm text-slate-300">
            These patients are exempt from the 12-month established clinical relationship requirement:
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {quickCheck.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                <span className="text-sm text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-5xl space-y-10 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Evolution of Australian Telehealth</h2>
          <div className="space-y-4 text-sm text-slate-300">
            <p>
              <strong>March 2020:</strong> Emergency telehealth arrangements introduced for medical practitioners (GPs and
              specialists) during the COVID-19 pandemic response.
            </p>
            <p>
              <strong>1 January 2022:</strong> Permanent telehealth programme established following successful implementation,
              formalising ongoing arrangements for medical practitioners.
            </p>
            <p>
              <strong>1 November 2025:</strong> Nurse Practitioner requirements align with medical practitioner standards,
              introducing the 12-month established clinical relationship requirement with the same six exemptions.
            </p>
            <p>
              Australian healthcare practitioners have different practice models, patient relationships, and billing
              arrangements. These telehealth regulations reflect the evolution and maturity of each profession's scope of
              practice within the Australian healthcare system.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-5xl grid gap-8 md:grid-cols-2">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Established Clinical Relationship</h2>
            <p className="text-sm text-slate-300">
              Patients must have attended an in-person consultation with their medical practitioner—or another practitioner
              within the same practice—within the 12 months prior to claiming a telehealth consultation.
            </p>
            <p className="text-sm text-slate-300">
              Medicare telehealth became a permanent programme on 1 January 2022. The 12-month requirement is the standard
              established clinical relationship for GP and specialist telehealth consultations.
            </p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
              <p className="font-semibold text-white">Documentation essentials</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>• Obtain and document patient consent for telehealth consultations.</li>
                <li>• Verify patient identity using appropriate methods.</li>
                <li>• Ensure telehealth is clinically appropriate for the consultation type.</li>
                <li>• Maintain comprehensive records as per standard consultation requirements.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Natural Disaster Telehealth Provisions</h2>
            <p className="text-sm text-slate-300">
              When a State or Territory government declares a natural disaster for a local government area, Medicare provides
              additional flexibility so patients can maintain access to telehealth services.
            </p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>• Automatic exemption from the 12-month established clinical relationship requirement.</li>
              <li>• Enhanced flexibility in consultation types and durations.</li>
              <li>• Priority processing for disaster-related telehealth claims.</li>
              <li>• Provisions typically remain active through the disaster and recovery period.</li>
            </ul>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
              <p className="font-semibold text-white">Understanding the grey areas</p>
              <p className="mt-2 text-slate-300">
                TeleCheck shows the black-and-white data (official disaster status, AGRN numbers). Clinicians evaluate the grey
                areas—such as whether the disaster affects a patient's access to care—for their specific circumstances.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-5xl space-y-6">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Official Sources</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {sources.map((source) => (
              <Button
                key={source.label}
                asChild
                variant="outline"
                className="rounded-2xl border-white/20 bg-white/10 py-4 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/15"
              >
                <a href={source.href} target="_blank" rel="noopener noreferrer">
                  {source.label}
                </a>
              </Button>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <div className="flex items-start gap-3">
            <BookOpen className="h-6 w-6 text-amber-300" />
            <div>
              <h2 className="text-lg font-semibold text-white">Important Compliance Note</h2>
              <p className="mt-2 text-sm text-slate-300">
                TeleCheck provides objective verification based on official government disaster declarations to support your
                clinical decision-making. Healthcare practitioners remain responsible for understanding and adhering to all
                applicable laws, regulations, and professional standards.
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Professional autonomy and clinical judgement are preserved—you make the final eligibility determination for your
                patients. Always consult official MBS guidelines and seek professional advice when needed. This information is
                current as of December 2024.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
