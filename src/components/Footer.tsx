'use client';

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Settings, HelpCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Footer = () => {
  const { isAdmin } = useAuth();

  const openSupportTicket = () => {
    // @ts-ignore - Outseta global object
    if (window.Outseta) {
      // @ts-ignore
      window.Outseta.support.open();
    }
  };

  return (
    <footer className="relative py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Logo className="h-6 w-6" />
              <span className="text-xl font-bold text-white">TeleCheck</span>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Australian Telehealth Disaster Verification for healthcare professionals.
            </p>
            <div className="text-slate-300 text-sm mb-4">
              <p>Justin Black</p>
              <p>ABN: 12048148174</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 relative z-30">
              <li><Link href="/about" className="relative z-40 block text-slate-300 hover:text-white transition-colors cursor-pointer underline decoration-dotted hover:decoration-solid">About</Link></li>
              <li><Link href="/how-to-use" className="relative z-40 block text-slate-300 hover:text-white transition-colors cursor-pointer underline decoration-dotted hover:decoration-solid">How to Use</Link></li>
              <li><Link href="/faq" className="relative z-40 block text-slate-300 hover:text-white transition-colors cursor-pointer underline decoration-dotted hover:decoration-solid">FAQ</Link></li>
              <li><Link href="/pricing" className="relative z-40 block text-slate-300 hover:text-white transition-colors cursor-pointer underline decoration-dotted hover:decoration-solid">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 relative z-30">
              <li><Link href="/telehealth-rules" className="relative z-40 block text-slate-300 hover:text-white transition-colors cursor-pointer underline decoration-dotted hover:decoration-solid">Telehealth Rules</Link></li>
              <li><Link href="/contact" className="relative z-40 block text-slate-300 hover:text-white transition-colors cursor-pointer underline decoration-dotted hover:decoration-solid">Contact</Link></li>
              <li><Link href="/members" className="relative z-40 block text-slate-300 hover:text-white transition-colors cursor-pointer underline decoration-dotted hover:decoration-solid">Members Portal</Link></li>
              <li>
                <button
                  onClick={openSupportTicket}
                  className="relative z-40 block text-slate-300 hover:text-white transition-colors cursor-pointer underline decoration-dotted hover:decoration-solid text-left"
                >
                  Get Help
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3 relative z-30">
              <li><Link href="/privacy" className="relative z-40 block text-slate-300 hover:text-white transition-colors cursor-pointer underline decoration-dotted hover:decoration-solid">Privacy Policy</Link></li>
              <li><Link href="/terms" className="relative z-40 block text-slate-300 hover:text-white transition-colors cursor-pointer underline decoration-dotted hover:decoration-solid">Terms of Service</Link></li>
              <li><Link href="/disclaimers" className="relative z-40 block text-slate-300 hover:text-white transition-colors cursor-pointer underline decoration-dotted hover:decoration-solid">Disclaimers</Link></li>
              <li><Link href="/refund-policy" className="relative z-40 block text-slate-300 hover:text-white transition-colors cursor-pointer underline decoration-dotted hover:decoration-solid">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
};