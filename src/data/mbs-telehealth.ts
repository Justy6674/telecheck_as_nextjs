export interface TelehealthExemption {
  title: string;
  description: string;
  details?: string;
}

export interface TelehealthRules {
  practitionerType: string;
  establishedRelationship: {
    requirement: string;
    details: string;
    effectiveDate?: string;
  };
  exemptions: TelehealthExemption[];
  modalities: {
    video: string;
    phone: string;
  };
  documentation: {
    consent: string;
    identity: string;
    clinical: string;
    records: string;
  };
  geographic: {
    restrictions: string;
    disaster: string;
  };
  sources: {
    title: string;
    url: string;
  }[];
  lastUpdated: string;
}

export const telehealthRulesData: Record<string, TelehealthRules> = {
  medical: {
    practitionerType: "Medical Practitioners",
    establishedRelationship: {
      requirement: "Patients must have attended an in-person consultation with their medical practitioner, or another practitioner within the same practice, within the 12 months prior to claiming a telehealth consultation.",
      details: "This is the standard established clinical relationship requirement for GP and specialist telehealth consultations."
    },
    exemptions: [
      {
        title: "Children under 12 months",
        description: "No established relationship required",
        details: "Recognizes the unique healthcare needs of infants and frequent provider changes in early childhood."
      },
      {
        title: "People who are homeless",
        description: "No established relationship required",
        details: "Acknowledges barriers to maintaining consistent healthcare relationships for homeless individuals."
      },
      {
        title: "Aboriginal Medical Service (AMS) or Aboriginal Community Controlled Health Service (ACCHS) patients",
        description: "Patients of medical practitioners at an AMS or ACCHS are exempt",
        details: "Supports culturally appropriate healthcare delivery in Aboriginal and Torres Strait Islander communities."
      },
      {
        title: "COVID-19 isolation/quarantine",
        description: "People isolating due to COVID-related public health orders or in COVID-19 quarantine",
        details: "Temporary exemption to support healthcare access during pandemic restrictions."
      },
      {
        title: "Natural disaster affected areas",
        description: "People living in local government areas declared a natural disaster by State or Territory government",
        details: "Provides healthcare access when normal services may be disrupted by emergencies."
      },
      {
        title: "Blood Borne Virus and Sexual or Reproductive Health (BBVSRH)",
        description: "Consultations specifically for BBVSRH are exempt from established relationship requirements",
        details: "Includes HIV/AIDS, hepatitis B/C, contraception, STI screening/treatment, abortion care, menopause management, PCOS treatment, fertility consultations, and sexual health counselling. Weight loss consultations are NOT included unless directly related to reproductive health (e.g., PCOS-related weight management)."
      }
    ],
    modalities: {
      video: "Video consultations are preferred where clinically appropriate and technically feasible.",
      phone: "Phone consultations are available when video is not suitable or accessible for the patient."
    },
    documentation: {
      consent: "Obtain and document patient consent for telehealth consultation.",
      identity: "Verify patient identity using appropriate methods.",
      clinical: "Ensure clinical appropriateness of telehealth for the consultation type.",
      records: "Maintain comprehensive records as per standard consultation requirements."
    },
    geographic: {
      restrictions: "No geographic restrictions apply to telehealth consultations for medical practitioners.",
      disaster: "Additional flexibility may apply during declared emergency situations."
    },
    sources: [
      {
        title: "MBS Telehealth Services Factsheet",
        url: "http://www.mbsonline.gov.au/internet/mbsonline/publishing.nsf/Content/Factsheet-TelehealthServices"
      },
      {
        title: "Services Australia - Telehealth",
        url: "https://www.servicesaustralia.gov.au/telehealth-for-health-professionals"
      },
      {
        title: "Department of Health - Telehealth",
        url: "https://www.health.gov.au/our-work/digital-health/telehealth"
      },
      {
        title: "Emergency Health Management",
        url: "https://www.health.gov.au/topics/emergency-health-management/support-after-a-natural-disaster"
      }
    ],
    lastUpdated: "December 2024"
  },
  nurse: {
    practitionerType: "Nurse Practitioners",
    establishedRelationship: {
      requirement: "From 1 November 2025, patients must have attended an in-person consultation with their Nurse Practitioner, or another practitioner within the same practice, within the 12 months prior to claiming a telehealth consultation.",
      details: "This aligns Nurse Practitioner telehealth requirements with those of medical practitioners.",
      effectiveDate: "1 November 2025"
    },
    exemptions: [
      {
        title: "Children under 12 months",
        description: "No established relationship required",
        details: "Same exemption as applies to medical practitioners."
      },
      {
        title: "People who are homeless",
        description: "No established relationship required",
        details: "Acknowledges barriers to maintaining consistent healthcare relationships."
      },
      {
        title: "Aboriginal Medical Service (AMS) or Aboriginal Community Controlled Health Service (ACCHS) patients",
        description: "Patients of nurse practitioners at an AMS or ACCHS are exempt",
        details: "Supports culturally appropriate healthcare delivery in Aboriginal and Torres Strait Islander communities."
      },
      {
        title: "COVID-19 isolation/quarantine",
        description: "People isolating due to COVID-related public health orders or in COVID-19 quarantine",
        details: "Consistent with medical practitioner exemptions."
      },
      {
        title: "Natural disaster affected areas",
        description: "People living in local government areas declared a natural disaster by State or Territory government",
        details: "Emergency access provisions during disaster situations."
      },
      {
        title: "Blood Borne Virus and Sexual or Reproductive Health (BBVSRH)",
        description: "Consultations specifically for BBVSRH are exempt from established relationship requirements",
        details: "Includes HIV/AIDS, hepatitis B/C, contraception, STI screening/treatment, abortion care, menopause management, PCOS treatment, fertility consultations, and sexual health counselling. Note: General weight loss consultations are NOT covered unless directly related to reproductive health conditions like PCOS."
      }
    ],
    modalities: {
      video: "Video consultations are preferred where clinically appropriate and technically feasible.",
      phone: "Phone consultations are available when video is not suitable or accessible for the patient."
    },
    documentation: {
      consent: "Obtain and document patient consent for telehealth consultation.",
      identity: "Verify patient identity using appropriate methods.",
      clinical: "Ensure clinical appropriateness of telehealth for the consultation type within NP scope of practice.",
      records: "Maintain comprehensive records as per standard consultation requirements."
    },
    geographic: {
      restrictions: "No geographic restrictions apply to telehealth consultations for nurse practitioners.",
      disaster: "Additional flexibility may apply during declared emergency situations."
    },
    sources: [
      {
        title: "Australian College of Nurse Practitioners - Telehealth Update",
        url: "https://www.acnp.org.au"
      },
      {
        title: "MBS Telehealth Services Factsheet",
        url: "http://www.mbsonline.gov.au/internet/mbsonline/publishing.nsf/Content/Factsheet-TelehealthServices"
      },
      {
        title: "Department of Health - Telehealth",
        url: "https://www.health.gov.au/our-work/digital-health/telehealth"
      },
      {
        title: "Emergency Health Management",
        url: "https://www.health.gov.au/topics/emergency-health-management/support-after-a-natural-disaster"
      }
    ],
    lastUpdated: "December 2024"
  }
};

export const disasterProvisions = {
  title: "Natural Disaster Telehealth Provisions",
  description: "Special telehealth arrangements for disaster-affected areas",
  details: [
    "Automatic exemption from established clinical relationship requirements",
    "Enhanced flexibility in consultation types and durations", 
    "Priority processing for disaster-related telehealth claims",
    "Temporary expansion of eligible practitioner types where needed"
  ],
  trigger: "Activated when a State or Territory government declares a natural disaster for a local government area",
  duration: "Typically remains in effect for the duration of the disaster declaration plus recovery period",
  source: "https://www.health.gov.au/topics/emergency-health-management/support-after-a-natural-disaster"
};