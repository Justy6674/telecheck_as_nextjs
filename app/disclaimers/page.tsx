import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const Disclaimers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Disclaimers for TeleCheck Website</h1>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 space-y-8 text-slate-300">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Medical Advice Disclaimer</h2>
              <ul className="list-disc list-inside space-y-3">
                <li><strong>Informational purposes only:</strong> TeleCheck provides general information about telehealth eligibility and Medicare coverage. It is not a substitute for professional medical advice, diagnosis, or treatment. Users should consult their own qualified General Practitioner (GP) or Nurse Practitioner (NP) before making any healthcare decisions.</li>
                <li><strong>No doctor–patient relationship:</strong> Using TeleCheck does not create a medical consultation or doctor–patient relationship. The site's output (including any templated notes) is a guide only and must be reviewed by a clinician. In other words, TeleCheck does not "practice medicine," and individuals should always seek personalized advice from a registered health professional.</li>
                <li><strong>Emergency warning:</strong> This tool is not for emergencies. If a user is experiencing a medical emergency (e.g. severe symptoms or life-threatening conditions), they should call 000 (Australia's emergency number) or go to the nearest emergency department immediately.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Telehealth & Medicare Disclaimer</h2>
              <ul className="list-disc list-inside space-y-3">
                <li><strong>Not an official government or Medicare tool:</strong> TeleCheck estimates Medicare telehealth eligibility based on current rules, but it is not affiliated with or endorsed by the Australian Government, Medicare, or any official health body. Users should verify any eligibility or rebate information against the current Medicare Benefits Schedule (MBS) and official Department of Health resources. TeleCheck cannot guarantee Medicare rebates or coverage; policies may change at any time.</li>
                <li><strong>Clinician's discretion and compliance:</strong> The treating clinician always has ultimate authority. AHPRA and MBS guidelines remind providers that they must stay aware of the detailed rules for telehealth billing and service eligibility. TeleCheck does not replace the need for clinicians to use their judgment or to comply with all legal and professional requirements. In particular, "practitioners who participate in telehealth need to be aware of and comply with relevant regulations and legislation".</li>
                <li><strong>No warranty on legal compliance:</strong> The information on TeleCheck is provided "as is" and may not reflect the latest legislative or Medicare changes. We assume no liability for any errors or omissions. Users should use the tool as a guide only and not rely on it as the sole basis for billing or clinical decisions. (For example, official health disclaimers note that online information is not guaranteed to be up-to-date or complete.)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Healthcare Professional / Provider Notice</h2>
              <ul className="list-disc list-inside space-y-3">
                <li><strong>Guide for clinicians:</strong> Although a clinician helped develop TeleCheck, the app itself is an informational aid. Any note templates or guidance it provides must be adapted and approved by a qualified clinician. It is the responsibility of each GP or NP to ensure that patient notes, referrals, and billing are accurate and comply with professional standards. The site is not a substitute for clinical judgment or professional training.</li>
                <li><strong>Professional standards:</strong> TeleCheck is not providing medical treatment advice or performing any aspect of care. Health practitioners should continue to follow all AHPRA codes and telehealth guidelines in their practice. For instance, AHPRA explicitly requires practitioners to follow confidentiality and privacy laws and obtain informed consent, regardless of whether care is delivered in person or via technology. TeleCheck does not handle patient records; practitioners must maintain their own record-keeping and privacy compliance as required by law.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Privacy and No Patient Data Storage</h2>
              <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 mb-4">
                <p className="text-green-200 font-medium">
                  <strong>Privacy by Design:</strong> TeleCheck operates on a strict no-patient-data policy.
                  We do not collect, store, or retain any patient information whatsoever.
                </p>
              </div>
              <ul className="list-disc list-inside space-y-3">
                <li><strong>No personal data is collected or stored:</strong> We do not collect, save, or share any identifiable patient information. Any input (like a postcode) is used only momentarily to compute an answer and is not retained. This means user privacy is protected by design. Our approach is consistent with Australian privacy principles – for example, government sites note that websites must handle personal information under the Privacy Act 1988 and Australian Privacy Principles.</li>
                <li><strong>Practitioner responsibility for records:</strong> TeleCheck is not a record-keeping system. If a patient provides information through the app, clinicians should document relevant details in their own secure systems following standard legal and professional requirements. AHPRA guidelines remind practitioners to manage all health records in compliance with legislation. Users should avoid entering sensitive personal data into this tool, and clinicians should rely on their official processes for confidentiality.</li>
                <li><strong>Business entity:</strong> TeleCheck is operated by Justin Black, ABN: 12048148174, Australia. All privacy protections and data handling policies are maintained in accordance with Australian law.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Liability and Use-at-Own-Risk</h2>
              <ul className="list-disc list-inside space-y-3">
                <li><strong>No warranty or guarantee:</strong> TeleCheck and its authors make no warranties about the accuracy, reliability or completeness of the information. As the Australian Department of Health disclaimer notes, online health information "does not take the place of professional or medical advice" and the government accepts no liability for errors.</li>
                <li><strong>Assumption of risk:</strong> By using TeleCheck, users acknowledge that they do so at their own risk. We disclaim any liability for direct or indirect damages, losses or injuries that may result from using the site. (Similar legal notices explicitly state that users assume all responsibility and that the site's operators are not liable for any outcome of use.) In short, TeleCheck is a helpful tool, but you should verify all critical decisions through official sources and professional advice.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Sources</h2>
              <p>
                These recommendations draw on Australian health and legal guidelines. For example, the Department of Health's official disclaimer emphasizes that web information "does not take the place of professional or medical advice", and AHPRA's telehealth guidance underscores the need for providers to comply with regulations and uphold standards. The above wording aligns with best practices for health websites to mitigate legal risk while serving patients and clinicians.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Disclaimers;