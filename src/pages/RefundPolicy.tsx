import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Refund Policy</h1>
          
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 space-y-6 text-slate-300">
            <section>
              <p className="text-sm text-slate-400 mb-6">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>

              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 mb-6">
                <p className="text-blue-200">
                  <strong>Business Entity:</strong> TeleCheck is operated by Justin Black, ABN: 12048148174, Australia.
                  All billing and refunds are processed through Outseta's secure payment system.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">30-Day Money-Back Guarantee</h2>
              <p>
                We offer a 30-day money-back guarantee for all TeleCheck Professional subscriptions.
                Professional is designed for ONE INDIVIDUAL PRACTITIONER or ONE CLINIC with ONE PRACTITIONER.
                If you're not satisfied with the service within the first 30 days, you can request a full refund.
                This guarantee applies to new subscribers only.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Outseta Payment Processing</h2>
              <div className="space-y-4">
                <p>
                  TeleCheck uses Outseta for secure payment processing and subscription management.
                  All billing, refunds, and payment disputes are handled through Outseta's system in accordance with their policies:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Outseta Terms:</strong> <a href="https://www.outseta.com/terms" className="text-red-400 hover:text-red-300 transition-colours" target="_blank" rel="noopener noreferrer">https://www.outseta.com/terms</a></li>
                  <li><strong>Outseta Billing Policy:</strong> Refer to Outseta's documentation for detailed billing and refund procedures</li>
                  <li><strong>Secure Processing:</strong> All payments are processed securely through Outseta's PCI-compliant system</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Refund Process</h2>
              <div className="space-y-4">
                <p>To request a refund:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Contact us at <a href="mailto:support@telecheck.com.au" className="text-red-400 hover:text-red-300 transition-colours">support@telecheck.com.au</a></li>
                  <li>Use the support ticket system in your member dashboard</li>
                  <li>Provide your subscription details and reason for the refund request</li>
                  <li>Refunds will be processed through Outseta within 5-7 business days</li>
                  <li>Refunds will be credited to the original payment method used during subscription</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Eligibility Criteria</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Refund requests must be made within 30 days of initial subscription</li>
                <li>Account must be in good standing (no abuse, misuse, or policy violations)</li>
                <li>Applicable to first-time TeleCheck subscribers only</li>
                <li>One refund per customer/practice/email address</li>
                <li>Refund requests for subscriptions older than 30 days will be considered on a case-by-case basis</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Subscription Management</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white mb-2">Cancellation Policy</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>You can cancel your subscription at any time through your Outseta account dashboard</li>
                  <li>Cancellations take effect at the end of the current billing period</li>
                  <li>No partial refunds are provided for unused portions of a billing period after the 30-day guarantee expires</li>
                  <li>You will retain access to TeleCheck until the end of your current billing period</li>
                </ul>

                <h3 className="text-lg font-medium text-white mb-2 mt-4">Subscription Changes</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Plan upgrades take effect immediately with prorated billing</li>
                  <li>Plan downgrades take effect at the next billing cycle</li>
                  <li>All subscription changes are managed through Outseta's billing system</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Disputed Charges and Payment Issues</h2>
              <div className="space-y-4">
                <p>
                  If you believe you've been charged in error or have payment-related concerns:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Contact TeleCheck support first at <a href="mailto:support@telecheck.com.au" className="text-red-400 hover:text-red-300 transition-colours">support@telecheck.com.au</a></li>
                  <li>We will work with Outseta to investigate and resolve billing issues promptly</li>
                  <li>Please allow 3-5 business days for investigation before disputing charges with your bank</li>
                  <li>Chargebacks may result in immediate service suspension pending resolution</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Australian Consumer Law</h2>
              <p>
                This refund policy operates in addition to your rights under Australian Consumer Law.
                Nothing in this policy limits your statutory rights as an Australian consumer, including
                rights to refunds for services that fail to meet consumer guarantees.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
              <p>For refund requests, billing questions, or payment support:</p>
              <div className="mt-4 space-y-2">
                <p><strong>Email:</strong> <a href="mailto:support@telecheck.com.au" className="text-red-400 hover:text-red-300 transition-colours">support@telecheck.com.au</a></p>
                <p><strong>Business:</strong> Justin Black, ABN: 12048148174</p>
                <p><strong>Member Portal:</strong> Use the support ticket system in your dashboard</p>
                <p><strong>Response Time:</strong> We aim to respond to refund requests within 24-48 hours</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};