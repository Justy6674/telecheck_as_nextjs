import React, { useState } from "react";

type Props = {
  disasterLinks?: { label: string; href: string }[];
};

export default function DisasterExemptionNote({
  disasterLinks = [
    { label: "Disaster Assist – Australian Government", href: "https://www.disasterassist.gov.au" },
    { label: "State/Territory disaster pages", href: "https://www.disasterassist.gov.au/Pages/disaster-information/Current-Disasters.aspx" }
  ]
}: Props) {
  const [openClinician, setOpenClinician] = useState(false);

  return (
    <section className="role-consumer-card">
      <div>
        <h3 className="font-semibold text-role-consumer text-lg md:text-xl mb-3">
          Disaster-affected area resident?
        </h3>
        
        <p className="text-sm md:text-base leading-relaxed text-muted-foreground">
          Some disasters stay "open" for years while communities recover. If your suburb or LGA is listed as a current disaster-affected area, you may qualify for Medicare telehealth rebates without the 12-month relationship rule. If unsure, check the official listings and share details with your clinician.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {disasterLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg border border-role-consumer bg-role-consumer-10 px-3 py-2 text-xs md:text-sm hover:bg-role-consumer-20 transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpenClinician((s) => !s)}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-role-practitioner bg-role-practitioner-10 px-3 py-2 text-xs md:text-sm hover:bg-role-practitioner-20 transition-colors duration-200"
          aria-expanded={openClinician}
        >
          {openClinician ? "Hide clinician note" : "Show clinician note (risk & documentation)"}
        </button>

        {openClinician && (
          <div className="mt-3 rounded-xl border border-role-practitioner bg-role-practitioner-10 p-3 md:p-4">
            <h4 className="font-semibold text-role-practitioner text-sm md:text-base">
              Clinician note — disaster eligibility is not always time-limited
            </h4>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">
              Disaster declarations are not routinely closed on fixed dates. Some remain open for extended periods due to long recovery. Verify the current status for the <span className="text-role-consumer">patient's</span> LGA/postcode using official resources, apply clinical judgement, and document your rationale if relying on the exemption.
            </p>
            <ul className="mt-3 list-disc pl-5 text-sm md:text-base space-y-1 text-muted-foreground">
              <li>Confirm <span className="text-role-consumer">patient</span> address and affected LGA/postcode.</li>
              <li>Record disaster name/reference and the date checked.</li>
              <li>Describe how the disaster limits access to care.</li>
              <li>Note your decision and reasoning; save a screenshot/PDF where practicable.</li>
              <li>Recheck status for ongoing use across visits; consider alternative billing if uncertain.</li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}