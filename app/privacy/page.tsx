import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 space-y-6 text-slate-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Privacy and No Patient Data Storage</h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>No personal data is collected or stored:</strong> We do not collect, save, or share any identifiable patient information. Any input (like a postcode) is used only momentarily to compute an answer and is not retained. This means user privacy is protected by design. Our approach is consistent with Australian privacy principles – for example, government sites note that websites must handle personal information under the Privacy Act 1988 and Australian Privacy Principles.</li>
                <li><strong>Practitioner responsibility for records:</strong> TeleCheck is not a record-keeping system. If a patient provides information through the app, clinicians should document relevant details in their own secure systems following standard legal and professional requirements. AHPRA guidelines remind practitioners to manage all health records in compliance with legislation. Users should avoid entering sensitive personal data into this tool, and clinicians should rely on their official processes for confidentiality.</li>
                <li><strong>Business Entity Information:</strong> TeleCheck is operated by Justin Black, ABN: 12048148174, Australia. All data processing activities are conducted in accordance with Australian privacy laws and regulations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Information Collection</h2>
              <p>
                TeleCheck operates on a privacy-by-design principle. We do not store, track, or retain any personal or 
                health information entered into the system. All eligibility checks are performed in real-time without 
                data persistence.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Cookies and Analytics</h2>
              <p>
                We may use essential cookies for website functionality and anonymous analytics to improve our service.
                No personally identifiable information is collected through these mechanisms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Outseta Account Management</h3>
                  <p className="text-slate-300">
                    TeleCheck uses Outseta for user authentication, subscription management, and billing. When you create an account
                    or subscribe to our services, your information is processed by Outseta in accordance with their privacy policy
                    and GDPR compliance standards.
                  </p>
                  <ul className="list-disc list-inside mt-2 text-slate-300 space-y-1">
                    <li><strong>Outseta Privacy Policy:</strong> <a href="https://www.outseta.com/privacy-policy" className="text-red-400 hover:text-red-300 transition-colors" target="_blank" rel="noopener noreferrer">https://www.outseta.com/privacy-policy</a></li>
                    <li><strong>GDPR Compliance:</strong> Outseta is GDPR compliant and acts as a data processor for EU/UK users</li>
                    <li><strong>Data Processing:</strong> Account details, billing information, and subscription status are processed by Outseta</li>
                    <li><strong>Data Location:</strong> Outseta securely stores data in compliance with international privacy laws</li>
                  </ul>
                </div>
                <p className="text-slate-300">
                  Other third-party services used by TeleCheck operate under their own privacy policies.
                  We do not share personal health data with third parties beyond what is necessary for service operation.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us through the website.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;