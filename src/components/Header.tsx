'use client';

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ComingSoonDialog } from "@/components/ComingSoonDialog";
import { SupportButton } from "@/components/SupportButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, User, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const linkClass = (href: string) => {
    const isActive =
      href === "/"
        ? pathname === "/"
        : pathname.startsWith(href);

    return [
      "text-sm font-medium transition-colors tracking-tight",
      isActive ? "text-white" : "text-slate-200/80 hover:text-white",
    ].join(" ");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/check-eligibility", label: "For Patients" },
    { href: "/telehealth-rules", label: "Telehealth Rules" },
    { href: "/how-to-use", label: "How to Use" },
    { href: "/faq", label: "FAQ" },
    { href: "/about", label: "About" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050b16]/85 backdrop-blur supports-[backdrop-filter]:bg-[#050b16]/75">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <Logo className="h-8 w-8" />
            <div className="leading-tight">
              <span className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                TeleCheck
              </span>
              <p className="text-xs text-slate-200/70 hidden sm:block">
                Australian Telehealth Disaster Verification
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                {link.label}
              </Link>
            ))}
            <SupportButton
              variant="outline"
              size="sm"
              className="border-white/10 text-slate-200/90 hover:text-white hover:border-white/30"
            >
              Help
            </SupportButton>

            {/* Anonymous buttons - only shown when logged out */}
            <Button
              size="sm"
              variant="outline"
              className="border-white/10 text-slate-100 hover:border-white/30 hover:bg-white/5"
              data-o-anonymous
              data-o-auth="1"
              data-mode="popup"
              data-widget-mode="login"
            >
              Log In
            </Button>
            <Button
              size="sm"
              variant="default"
              className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white shadow-lg shadow-red-500/30"
              data-o-anonymous
              data-o-auth="1"
              data-mode="popup"
              data-widget-mode="register"
              data-plan-uid="pWrbAMWn"
              data-skip-plan-options="true"
            >
              Sign Up
            </Button>

            {/* Account dropdown - only shown when logged in */}
            <DropdownMenu data-o-authenticated>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-slate-100 hover:border-white/30 hover:bg-white/5"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span data-o-member="FirstName">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => router.push('/members')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem data-o-profile data-mode="popup">
                  <User className="h-4 w-4 mr-2" />
                  My Account
                </DropdownMenuItem>
                <DropdownMenuItem data-o-logout-link>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 text-slate-100 hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-[#050b16] border-white/10 text-slate-100">
                <div className="flex flex-col gap-6 mt-6">
                  <div className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={linkClass(link.href)}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t pt-6 space-y-4">
                    <SupportButton variant="outline" className="w-full border-white/10">
                      Help
                    </SupportButton>

                    {/* Mobile anonymous buttons */}
                    <Button
                      variant="outline"
                      className="w-full border-white/10 text-slate-100"
                      data-o-anonymous
                      data-o-auth="1"
                      data-mode="popup"
                      data-widget-mode="login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log In
                    </Button>
                    <Button
                      variant="default"
                      className="w-full bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white"
                      data-o-anonymous
                      data-o-auth="1"
                      data-mode="popup"
                      data-widget-mode="register"
                      data-plan-uid="pWrbAMWn"
                      data-skip-plan-options="true"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Button>

                    {/* Mobile authenticated buttons */}
                    <Button
                      variant="outline"
                      className="w-full border-white/10 text-slate-100"
                      data-o-authenticated
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push('/members');
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-white/10 text-slate-100"
                      data-o-authenticated
                      data-o-logout-link
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Log Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <ComingSoonDialog open={comingSoonOpen} onOpenChange={setComingSoonOpen} />
    </>
  );
};