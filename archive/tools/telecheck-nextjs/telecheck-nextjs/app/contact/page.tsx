import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Mail, MapPin, Phone } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Contact Us</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                   <div>
                     <h3 className="text-white font-medium">Email</h3>
                     <p className="text-slate-300">
                       <a href="mailto:support@telecheck.com.au" className="text-red-400 hover:text-red-300 transition-colors">
                         support@telecheck.com.au
                       </a>
                     </p>
                     <p className="text-slate-300 text-sm mt-1">For support and inquiries</p>
                   </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium">Business Details</h3>
                     <p className="text-slate-300">
                       Justin Black<br />
                       ABN: 12048148174<br />
                       Australia
                     </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-medium">Emergency</h3>
                    <p className="text-slate-300">
                      For medical emergencies, call 000 immediately.<br />
                      TeleCheck is not for emergency situations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Support Hours</h2>
              
              <div className="space-y-4 text-slate-300">
                <div>
                  <h3 className="text-white font-medium">Technical Support</h3>
                  <p>Available through member dashboard</p>
                </div>
                
                <div>
                  <h3 className="text-white font-medium">Response Time</h3>
                  <p>We aim to respond to all inquiries within 24-48 hours</p>
                </div>
                
                <div>
                  <h3 className="text-white font-medium">Professional Support</h3>
                  <p>Clinical guidance and professional questions handled by qualified healthcare professionals</p>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h3 className="text-red-400 font-medium mb-2">Important Notice</h3>
                <p className="text-sm text-slate-300">
                  TeleCheck provides information only and does not replace professional medical advice. 
                  Always consult with qualified healthcare professionals for medical decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};