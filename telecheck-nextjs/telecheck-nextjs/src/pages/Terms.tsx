import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 space-y-6 text-slate-300">
            <section>
              <p className="text-sm text-slate-400 mb-6">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>

              <h2 className="text-2xl font-semibold text-white mb-4">Acceptance of Terms</h2>
              <p>
                By accessing and using TeleCheck ("the Service"), you accept and agree to be bound by these Terms of Service.
                TeleCheck is operated by Justin Black, ABN: 12048148174, Australia. If you do not agree to these terms,
                please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Account Management and Billing</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Outseta Integration</h3>
                  <p className="text-slate-300">
                    TeleCheck uses Outseta for account management, subscription billing, and user authentication.
                    By subscribing to TeleCheck, you also agree to Outseta's Terms of Service and Privacy Policy:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-slate-300 space-y-1">
                    <li><strong>Outseta Terms:</strong> <a href="https://www.outseta.com/terms" className="text-red-400 hover:text-red-300 transition-colours" target="_blank" rel="noopener noreferrer">https://www.outseta.com/terms</a></li>
                    <li><strong>Outseta Privacy Policy:</strong> <a href="https://www.outseta.com/privacy-policy" className="text-red-400 hover:text-red-300 transition-colours" target="_blank" rel="noopener noreferrer">https://www.outseta.com/privacy-policy</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Subscription Terms</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Subscriptions are billed monthly in Australian Dollars (AUD)</li>
                    <li>Payment is processed securely through Outseta's billing system</li>
                    <li>You may cancel your subscription at any time through your account dashboard</li>
                    <li>Refunds are handled in accordance with our Refund Policy</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Service Description</h2>
              <div className="space-y-4">
                <p>
                  TeleCheck provides information about Medicare telehealth disaster eligibility for Australian healthcare professionals.
                  The service includes:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Real-time disaster declaration verification</li>
                  <li>Postcode-based telehealth eligibility checking</li>
                  <li>Clinic analysis and reporting tools</li>
                  <li>Saved search functionality for authenticated users</li>
                </ul>
                <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                  <p>
                    <strong>Important:</strong> TeleCheck provides information only and does not store any patient data.
                    It does not constitute medical advice, professional guidance, or replace the need for healthcare
                    professionals to verify Medicare requirements through official channels. No patient information
                    is collected, stored, or retained by TeleCheck.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">User Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>You must be a qualified healthcare professional to use TeleCheck for patient care decisions</li>
                <li>You are responsible for verifying all information through official Medicare channels</li>
                <li>You must comply with all applicable Australian healthcare regulations (AHPRA, TGA, etc.)</li>
                <li>You must not share your account credentials with unauthorised persons</li>
                <li>You must not use the service for any unlawful or unauthorised purpose</li>
                <li>You must not attempt to reverse engineer, modify, or interfere with the service</li>
                <li>You acknowledge that TeleCheck does not store patient data and you remain responsible for all patient record keeping</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data and Privacy</h2>
              <div className="space-y-4">
                <p>
                  TeleCheck operates on a privacy-by-design principle:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>No Patient Data Storage:</strong> We do not collect, store, or retain any patient information</li>
                  <li><strong>Postcode Verification Only:</strong> Information entered is used momentarily for eligibility checks and not stored</li>
                  <li><strong>Account Data:</strong> Only practitioner account information is managed through Outseta</li>
                  <li><strong>Privacy Policy:</strong> Our collection and use of information is governed by our Privacy Policy</li>
                </ul>
                <p>
                  Healthcare professionals remain fully responsible for patient record keeping in their own secure systems.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Intellectual Property</h2>
              <p>
                All content, features, and functionality of TeleCheck are owned by Justin Black and are protected by
                Australian and international copyright, trademark, and other intellectual property laws. You may not
                reproduce, distribute, modify, or create derivative works without express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
              <div className="space-y-4">
                <p>
                  To the maximum extent permitted by Australian law:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>TeleCheck is provided "as is" without any warranties, express or implied</li>
                  <li>We do not guarantee the accuracy, completeness, or timeliness of information</li>
                  <li>We are not liable for any direct, indirect, incidental, or consequential damages</li>
                  <li>Our total liability is limited to the amount paid for the service in the preceding 12 months</li>
                  <li>We are not responsible for decisions made based on information provided by TeleCheck</li>
                </ul>
                <p>
                  <strong>Healthcare Professional Responsibility:</strong> Healthcare professionals remain fully responsible
                  for all clinical decisions and must verify all Medicare requirements independently.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Service Availability</h2>
              <p>
                We strive to maintain service availability but do not guarantee uninterrupted access. We may temporarily
                suspend service for maintenance, updates, or other operational reasons. We are not liable for any
                disruption to service availability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Termination</h2>
              <div className="space-y-4">
                <p>
                  Either party may terminate your use of TeleCheck:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>You may cancel your subscription at any time through your account dashboard</li>
                  <li>We may suspend or terminate accounts for breach of these terms</li>
                  <li>We may discontinue the service with reasonable notice</li>
                  <li>Upon termination, your access to saved search history will be removed after 30 days</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Governing Law</h2>
              <p>
                These Terms of Service are governed by the laws of Australia. Any disputes will be resolved in
                Australian courts. If any provision is found unenforceable, the remaining provisions will continue
                in full effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to Terms</h2>
              <p>
                We may update these Terms of Service from time to time. Significant changes will be communicated
                to users via email or service notifications. Continued use of TeleCheck after changes constitutes
                acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-2">
                <p><strong>Email:</strong> <a href="mailto:support@telecheck.com.au" className="text-red-400 hover:text-red-300 transition-colours">support@telecheck.com.au</a></p>
                <p><strong>Business:</strong> Justin Black, ABN: 12048148174</p>
                <p><strong>Location:</strong> Australia</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};