'use client';

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
export const Footer = () => {
  const openSupportTicket = () => {
    if (typeof window !== "undefined" && (window as any).Outseta?.support?.open) {
      (window as any).Outseta.support.open();
    }
  };

  return (
    <footer className="relative border-t border-white/5 bg-[#050b16]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-slate-200">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Logo className="h-8 w-8" />
              <span className="text-xl font-semibold text-white tracking-tight">TeleCheck</span>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Australian Telehealth Disaster Verification for healthcare professionals.
            </p>
            <div className="text-slate-400 text-sm mb-4">
              <p>Justin Black</p>
              <p>ABN: 12048148174</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 relative z-30">
              <li><Link href="/about" className="relative z-40 block text-slate-300 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/how-to-use" className="relative z-40 block text-slate-300 hover:text-white transition-colors">How to Use</Link></li>
              <li><Link href="/faq" className="relative z-40 block text-slate-300 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/pricing" className="relative z-40 block text-slate-300 hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3 relative z-30">
              <li><Link href="/telehealth-rules" className="relative z-40 block text-slate-300 hover:text-white transition-colors">Telehealth Rules</Link></li>
              <li><Link href="/contact" className="relative z-40 block text-slate-300 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/members" className="relative z-40 block text-slate-300 hover:text-white transition-colors">Members Portal</Link></li>
              <li>
                <button
                  onClick={openSupportTicket}
                  className="relative z-40 block text-slate-300 hover:text-white transition-colors text-left"
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
              <li><Link href="/privacy" className="relative z-40 block text-slate-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="relative z-40 block text-slate-300 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/disclaimers" className="relative z-40 block text-slate-300 hover:text-white transition-colors">Disclaimers</Link></li>
              <li><Link href="/refund-policy" className="relative z-40 block text-slate-300 hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};