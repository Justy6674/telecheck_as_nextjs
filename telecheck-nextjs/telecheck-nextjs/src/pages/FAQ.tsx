import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HelpCircle, ChevronDown, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

export const FAQ = () => {
  const consumerFaqs = [
    {
      question: "What is TeleCheck and how can it help me?",
      answer: "TeleCheck is an Australian telehealth verification platform that helps you understand if you qualify for Medicare telehealth rebates when disaster exemptions apply. It's free for consumers to check their postcode and get guidance for their healthcare provider."
    },
    {
      question: "Do I need to pay to use TeleCheck as a patient?",
      answer: "No, TeleCheck is completely free for consumers and patients. You can check your postcode and generate a summary for your GP at no cost. Only healthcare practitioners pay for subscription access to professional tools."
    },
    {
      question: "How does Medicare billing work for telehealth consultations?",
      answer: "Your GP or healthcare practitioner handles all Medicare billing, not you. If you meet eligibility requirements, Medicare will provide rebates directly. If you don't qualify for Medicare rebates, your practitioner may offer private fee consultations."
    },
    {
      question: "What is the 12-month relationship requirement?",
      answer: "Generally, Medicare requires you to have seen your GP in person within the last 12 months to qualify for telehealth rebates. However, several exemptions exist, including living in disaster-declared areas, being under 12 months old, experiencing homelessness, or having certain health conditions."
    },
    {
      question: "Can I get telehealth rebates if I haven't seen my GP in over 12 months?",
      answer: "Yes, if you qualify for exemptions. The most common exemption is living in a disaster-declared area. TeleCheck helps identify if your postcode qualifies for this exemption. Other exemptions include age, health conditions, or special circumstances that your GP will assess."
    },
    {
      question: "How long do disaster declarations last for telehealth purposes?",
      answer: "Disaster declarations can remain active for many years because recovery takes time. Major floods, bushfires, cyclones, and droughts often have declarations that stay open for years. If your area was declared a disaster zone, you may still qualify for telehealth rebates, even years after the event."
    },
    {
      question: "What disasters qualify for telehealth exemptions?",
      answer: "All officially declared disasters by federal, state, or local governments can qualify, including bushfires, floods, cyclones, droughts, earthquakes, and other natural disasters. Check the official DisasterAssist.gov.au website or use TeleCheck to verify your area's status."
    },
    {
      question: "How do I know if my area is still considered disaster-affected?",
      answer: "Use TeleCheck's free postcode checker or visit DisasterAssist.gov.au to check current disaster declarations. Many disaster areas remain listed for years during recovery periods, so even older disasters may still provide telehealth eligibility."
    },
    {
      question: "What information should I bring to my telehealth appointment?",
      answer: "Bring your Medicare card, any relevant medical history, current medications list, and if using disaster exemptions, be prepared to confirm your residential address and postcode. Your GP may need to verify your location for billing purposes."
    },
    {
      question: "Can I use telehealth for any type of medical consultation?",
      answer: "Telehealth is suitable for many consultations including follow-ups, medication reviews, mental health appointments, and routine check-ins. However, physical examinations, procedures, or urgent care may require in-person visits. Your GP will advise what's appropriate."
    },
    {
      question: "What if my GP says I don't qualify for Medicare telehealth rebates?",
      answer: "Your GP makes the final determination on eligibility. If you don't qualify for Medicare rebates, they may offer private fee consultations or suggest an in-person appointment. You can also seek a second opinion from another qualified practitioner."
    },
    {
      question: "Are telehealth consultations as good as in-person visits?",
      answer: "Telehealth is excellent for many types of consultations, particularly follow-ups, mental health support, and medication management. However, physical examinations and certain procedures require in-person visits. Your GP will determine the most appropriate format for your needs."
    },
    {
      question: "What technology do I need for a telehealth consultation?",
      answer: "You'll need a device with internet connection, camera, and microphone - such as a smartphone, tablet, or computer. Your practice will provide instructions on their preferred platform. Ensure you have a private, well-lit space for the consultation."
    },
    {
      question: "Can I get prescriptions through telehealth?",
      answer: "Yes, your GP can prescribe medications during telehealth consultations. Prescriptions can be sent electronically to your preferred pharmacy or posted to you. Some medications may require in-person assessment before prescribing."
    },
    {
      question: "What if I have technical problems during my telehealth appointment?",
      answer: "Contact your practice immediately if you experience technical difficulties. Most practices have backup plans, such as phone consultations or rescheduling. Ensure you test your technology beforehand and have the practice's phone number ready."
    },
    {
      question: "Is my personal health information secure during telehealth?",
      answer: "Yes, healthcare practitioners must use secure, encrypted platforms that comply with Australian privacy laws. Your health information is protected by the same confidentiality requirements as in-person consultations."
    },
    {
      question: "Can I claim private health insurance for telehealth consultations?",
      answer: "This depends on your private health insurance policy and the type of consultation. Contact your insurer to confirm coverage. Medicare rebates apply regardless of private insurance if you meet eligibility requirements."
    },
    {
      question: "What if I need a medical certificate or referral?",
      answer: "Your GP can provide medical certificates, referrals, and other documentation during telehealth consultations. These can be emailed, posted, or made available for collection from the practice."
    },
    {
      question: "Can I use telehealth if I'm travelling or temporarily away from home?",
      answer: "Generally, you need to be in Australia for Medicare telehealth services. If you're temporarily in a different location due to disaster displacement, inform your GP as special provisions may apply. Check with your practice about their specific policies."
    },
    {
      question: "Where can I find more information about telehealth and disaster exemptions?",
      answer: "Visit the Department of Health website, DisasterAssist.gov.au for current disaster information, or use TeleCheck's free tools. Your GP is also the best source for advice specific to your situation and eligibility."
    }
  ];

  const practitionerFaqs = [
    {
      question: "How much does TeleCheck cost and how is pricing calculated?",
      answer: "TeleCheck costs $56.81 AUD per month per provider (including GST). This pricing is based on 3 × MBS Item 91189 fee ($24.10) × 70% to account for practice overhead, making it cost-neutral if you see just 3 eligible patients monthly."
    },
    {
      question: "What tools does TeleCheck provide for healthcare practitioners?",
      answer: "TeleCheck provides postcode verification tools to check disaster exemption eligibility and clinic analysis features for bulk patient data processing. You can upload patient files, generate demographic reports, and export comprehensive analytics to support your practice management and compliance needs."
    },
    {
      question: "How does the clinic analysis feature work as a business intelligence tool?",
      answer: "Clinic Analysis is TeleCheck's comprehensive business intelligence platform for healthcare practices. Upload your patient data (postcodes and demographics only - no names/DOB/phone numbers) to get strategic insights including: geographic patient distribution across states, rural/urban/remote patient classification, telehealth eligibility rates and revenue potential, time-based disaster analysis for audit strength, comprehensive demographic breakdowns, and professional reports with TeleCheck branding for presentations."
    },
    {
      question: "What clinical insights does clinic analysis provide?",
      answer: "Our clinic analysis provides medical intelligence including: Patient geographic distribution by Australian states, Rural vs Urban vs Remote patient classification using official remoteness codes, Disaster zone eligibility analysis for telehealth services, Time-based eligibility analysis for compliance documentation, Top disaster types affecting your practice, Service delivery optimization recommendations based on patient spread, and Professional clinical reports for practice planning and strategic decisions."
    },
    {
      question: "How does the geographic patient distribution analysis work?",
      answer: "TeleCheck analyzes your patient base geography using official Australian Bureau of Statistics data to show: Which states have the highest patient concentration, Rural vs Urban vs Remote patient distribution using official remoteness area classifications, Top postcodes by patient frequency, Patient spread analysis for service delivery planning, Distance and accessibility insights for telehealth vs in-person decisions, and Geographic risk assessment for disaster preparedness planning."
    },
    {
      question: "What telehealth eligibility insights does clinic analysis provide?",
      answer: "The clinic analysis provides comprehensive telehealth eligibility assessment including: Total eligible patients in disaster zones, Patient distribution across active disaster areas, Time-based analysis showing documentation requirements for compliance, Risk assessment for different patient cohorts, Geographic analysis for telehealth service delivery planning, and Clinical insights for optimizing patient care delivery in disaster-affected areas."
    },
    {
      question: "How does the time-based disaster analysis help with Medicare compliance?",
      answer: "Our time-based analysis categorizes eligible patients by disaster recency to show audit strength: Last 12 months (strongest audit position), Last 2 years (strong position), Last 5 years (moderate position), and Older than 5 years (requires review). This helps practices understand which patients represent the strongest compliance position for Medicare audits and plan appropriate documentation strategies."
    },
    {
      question: "What export and branding options are available for clinic analysis reports?",
      answer: "TeleCheck provides professional reporting options including: PDF reports with TeleCheck branding and professional styling, CSV data exports for further analysis, Email functionality to send reports to stakeholders, Branded executive summaries for presentations, Custom clinic logo integration options, and Comprehensive data including compliance disclaimers and generation timestamps for practice records."
    },
    {
      question: "What privacy protections are in place for clinic analysis?",
      answer: "TeleCheck enforces strict privacy protections: Upload ONLY postcodes and anonymized demographic data (age ranges, not DOBs), Remove ALL identifying information (names, phone numbers, Medicare numbers, addresses), Data is processed securely and encrypted during analysis, Results are not permanently stored on our servers, All processing complies with Privacy Act 1988 and healthcare data protection requirements, and Clear warnings throughout the interface remind users about data anonymization requirements."
    },
    {
      question: "What file formats are supported for data upload?",
      answer: "TeleCheck supports Excel (.xlsx, .xls) and CSV file formats for bulk patient data analysis. Ensure your files contain postcode and relevant demographic information for optimal analysis results."
    },
    {
      question: "How is my patient data protected during clinic analysis?",
      answer: "All uploaded patient data is processed securely and encrypted. Data is only used for generating your requested analytics and is not stored permanently on our servers. We comply with Australian privacy laws and healthcare data protection requirements."
    },
    {
      question: "What is MBS Item 91189 and when can it be used?",
      answer: "MBS Item 91189 is the professional attendance for telehealth consultations when normal telehealth requirements are waived due to exceptional circumstances, primarily disaster-related exemptions. It allows telehealth without the 12-month in-person requirement."
    },
    {
      question: "How do I verify if a patient qualifies for disaster exemptions?",
      answer: "Use TeleCheck's verification tools to check the patient's residential postcode against current government disaster declarations. Document the disaster name, reference number, date checked, and how the disaster affects the patient's access to care."
    },
    {
      question: "Are disaster declarations time-limited for billing purposes?",
      answer: "No, disaster declarations can remain active for years during recovery periods. Major events like the Black Summer bushfires, Lismore floods, and long-term droughts often have declarations open for multiple years. Always verify current status using official sources."
    },
    {
      question: "What documentation is required for disaster exemption billing?",
      answer: "Document the patient's residential address, cite the specific disaster declaration and reference, record the date you verified the information, note how the disaster affects access to care, and save evidence (screenshot/PDF) of the official declaration where practicable."
    },
    {
      question: "Can I use MBS Item 91189 for any patient in a disaster-declared area?",
      answer: "The patient must be a resident of the disaster-declared area and the disaster must reasonably affect their access to healthcare services. Use clinical judgement to determine if the exemption is appropriate and document your rationale."
    },
    {
      question: "What are my obligations for Medicare compliance with telehealth?",
      answer: "You must verify eligibility, maintain appropriate clinical records, ensure the service meets Medicare requirements, use secure technology platforms, and be prepared to provide documentation if audited. Professional responsibility remains with the practitioner."
    },
    {
      question: "How often should I reverify disaster status for ongoing patients?",
      answer: "Reverify disaster status periodically, especially for patients requiring multiple telehealth consultations over time. If you're uncertain about continued eligibility, consider private billing or in-person consultations with appropriate follow-up plans."
    },
    {
      question: "Does TeleCheck replace my obligation to verify eligibility?",
      answer: "No, TeleCheck provides tools to assist verification, but final responsibility for determining eligibility, applying clinical judgement, and ensuring Medicare compliance remains with the treating practitioner."
    },
    {
      question: "Can I bill both Medicare and private fees for telehealth?",
      answer: "No, you cannot bill both Medicare and private fees for the same consultation. If the patient doesn't meet Medicare eligibility, you may offer private fee consultations as an alternative."
    },
    {
      question: "What technology requirements apply to Medicare telehealth?",
      answer: "Use secure, encrypted video platforms that protect patient privacy. Ensure audio and video quality allows proper clinical assessment. Maintain records of the technology used and any technical issues encountered during consultations."
    },
    {
      question: "How do I handle patients who don't meet disaster exemption criteria?",
      answer: "Assess if they meet other exemption criteria (age under 12 months, homelessness, specific health conditions). If no exemptions apply, offer private fee consultations or in-person appointments with clear explanation of options."
    },
    {
      question: "What are the risks of incorrect Medicare telehealth billing?",
      answer: "Incorrect billing can result in Medicare audits, requirement to repay funds, penalties, and potential professional sanctions. Always verify eligibility thoroughly and maintain comprehensive documentation to support your billing decisions."
    },
    {
      question: "Can I use telehealth for mental health consultations under disaster exemptions?",
      answer: "Yes, MBS Item 91189 applies to general practice consultations, including mental health assessments. Additional mental health-specific telehealth items may also be available depending on the circumstances and provider qualifications."
    },
    {
      question: "How do I integrate TeleCheck into my practice workflow?",
      answer: "Use TeleCheck during appointment booking or patient screening to verify disaster eligibility before scheduling telehealth appointments. Train staff on verification processes and maintain documentation standards for audit purposes."
    },
    {
      question: "What if I disagree with TeleCheck's verification results?",
      answer: "TeleCheck provides information based on official government sources, but clinical judgement remains paramount. If you believe there's an error, verify independently using government sources and document your decision-making process."
    },
    {
      question: "Are there bulk billing implications for disaster exemption telehealth?",
      answer: "Disaster exemption telehealth follows the same bulk billing rules as standard consultations. You can choose to bulk bill or charge private fees, but cannot combine Medicare and private billing for the same service."
    },
    {
      question: "How do I handle emergency consultations via telehealth?",
      answer: "Emergency consultations may warrant telehealth under exceptional circumstances, but always prioritise patient safety. If physical examination or immediate intervention is needed, direct patients to appropriate emergency services or in-person care."
    },
    {
      question: "What continuing education is recommended for telehealth practise?",
      answer: "Stay updated on Medicare telehealth guidelines, technology security requirements, and disaster exemption policies. Consider formal telehealth training, cybersecurity education, and regular review of Medicare Benefits Schedule updates."
    },
    {
      question: "How can I provide feedback or report issues with TeleCheck?",
      answer: "Contact TeleCheck support at support@telecheck.com.au for technical issues, verification concerns, or feature requests. We aim to respond within 24 hours and continuously improve our platform based on practitioner feedback."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="scroll-reveal max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <Badge variant="secondary" className="mb-4">
              <HelpCircle className="h-4 w-4 mr-2" />
              Support Centre
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Frequently Asked Questions</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Get answers to common questions about TeleCheck and telehealth compliance
            </p>
          </div>

          {/* Consumer/Patient FAQs */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-4">
                <Info className="h-4 w-4 mr-2" />
                For Patients & Consumers
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Patient & Consumer Questions
              </h2>
              <p className="text-muted-foreground">
                Understanding your telehealth rights and Medicare eligibility
              </p>
            </div>
            
            <div className="role-consumer-card">
              <Accordion type="single" collapsible className="w-full p-6">
                {consumerFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`consumer-${index}`} className="border-border/50">
                    <AccordionTrigger className="text-left transition-colors hover:text-muted-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Practice Staff/Clinician FAQs */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-4">
                <HelpCircle className="h-4 w-4 mr-2" />
                For Healthcare Practitioners
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Practice Staff & Clinician Questions
              </h2>
              <p className="text-muted-foreground">
                Professional compliance, billing guidance, and practice management
              </p>
            </div>
            
            <div className="role-practitioner-card">
              <Accordion type="single" collapsible className="w-full p-6">
                {practitionerFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`practitioner-${index}`} className="border-border/50">
                    <AccordionTrigger className="text-left transition-colors hover:text-muted-foreground">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Future Enhancements */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <Badge variant="outline" className="mb-4">
                <HelpCircle className="h-4 w-4 mr-2" />
                Coming Soon
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                <span className="gradient-text">Future Enhancements</span>
              </h2>
              <p className="text-muted-foreground">
                Exciting new features and improvements in development
              </p>
            </div>
            
            <div className="floating-tile bg-gradient-glow p-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="future-1" className="border-border/50">
                  <AccordionTrigger className="text-left transition-colors hover:text-muted-foreground">
                    What new features are coming to TeleCheck?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    We're developing Clinic Wide Access for multi-provider practice management, enhanced clinic analysis with comprehensive demographic breakdowns by age ranges and location data, advanced reporting capabilities, and several exciting major enhancements that we'll announce soon. Stay tuned for updates!
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="future-2" className="border-border/50">
                  <AccordionTrigger className="text-left transition-colors hover:text-muted-foreground">
                    What is Clinic Wide Access?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Clinic Wide Access will enable comprehensive practice management across multiple providers, allowing clinic administrators to manage telehealth eligibility verification and patient analytics for their entire practice team from a centralized dashboard.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="future-3" className="border-border/50">
                  <AccordionTrigger className="text-left transition-colors hover:text-muted-foreground">
                    Will there be enhanced analytics and reporting features?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Yes! We're developing advanced demographic analysis including detailed age range breakdowns, comprehensive location data analysis, practice performance insights, compliance tracking dashboards, and exportable reports to help optimize your practice operations and patient care delivery.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="future-4" className="border-border/50">
                  <AccordionTrigger className="text-left transition-colors hover:text-muted-foreground">
                    When will these new features be available?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    We're actively developing these enhancements and will announce release dates soon. Current subscribers will receive priority access to new features as they become available. Follow our updates for the latest announcements about exciting new capabilities.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Card className="floating-tile bg-gradient-glow p-8">
              <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:support@telecheck.com.au" 
                  className="hover:underline font-medium"
                >
                  support@telecheck.com.au
                </a>
                <span className="text-muted-foreground hidden sm:inline">•</span>
                <span className="text-muted-foreground">
                  Response within 24 hours
                </span>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};