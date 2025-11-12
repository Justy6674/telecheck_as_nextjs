import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { NavLink } from "react-router-dom";
import { ComingSoonDialog } from "@/components/ComingSoonDialog";
import { SupportButton } from "@/components/SupportButton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut, User, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const NavItems = () => (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `text-sm transition-colors ${isActive ? 'text-red-400 font-medium' : 'text-white/90 hover:text-red-400'}`
        }
        onClick={() => setMobileMenuOpen(false)}
      >
        Home
      </NavLink>
      <NavLink
        to="/telehealth-rules"
        className={({ isActive }) =>
          `text-sm transition-colors ${isActive ? 'text-red-400 font-medium' : 'text-white/90 hover:text-red-400'}`
        }
        onClick={() => setMobileMenuOpen(false)}
      >
        Telehealth Rules
      </NavLink>
      <NavLink
        to="/how-to-use"
        className={({ isActive }) =>
          `text-sm transition-colors ${isActive ? 'text-red-400 font-medium' : 'text-white/90 hover:text-red-400'}`
        }
        onClick={() => setMobileMenuOpen(false)}
      >
        How to Use
      </NavLink>
      <NavLink
        to="/faq"
        className={({ isActive }) =>
          `text-sm transition-colors ${isActive ? 'text-red-400 font-medium' : 'text-white/90 hover:text-red-400'}`
        }
        onClick={() => setMobileMenuOpen(false)}
      >
        FAQ
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          `text-sm transition-colors ${isActive ? 'text-red-400 font-medium' : 'text-white/90 hover:text-red-400'}`
        }
        onClick={() => setMobileMenuOpen(false)}
      >
        About
      </NavLink>
      <NavLink
        to="/pricing"
        className={({ isActive }) =>
          `text-sm transition-colors ${isActive ? 'text-red-400 font-medium' : 'text-white/90 hover:text-red-400'}`
        }
        onClick={() => setMobileMenuOpen(false)}
      >
        Pricing
      </NavLink>
    </>
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Logo className="h-6 w-6" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">TeleCheck</h1>
              <p className="text-xs text-white/80 hidden sm:block">Australian Telehealth Disaster Verification</p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavItems />
            <SupportButton
              variant="ghost"
              size="sm"
              className="text-white/90 hover:text-red-400"
            >
              Help
            </SupportButton>

            {/* Anonymous buttons - only shown when logged out */}
            <Button
              size="sm"
              variant="outline"
              className="border-foreground/20 text-foreground hover:bg-foreground/10"
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
              className="bg-red-600 hover:bg-red-700"
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
                <Button variant="outline" size="sm" className="border-foreground/20 text-foreground hover:bg-foreground/10">
                  <User className="h-4 w-4 mr-2" />
                  <span data-o-member="FirstName">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => window.location.href = '/members'}>
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
                <Button variant="ghost" size="sm" className="p-2 text-foreground hover:bg-foreground/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-slate-900 border-slate-700">
                <div className="flex flex-col gap-6 mt-6">
                  <div className="flex flex-col gap-4">
                    <NavItems />
                  </div>
                  <div className="border-t pt-6 space-y-4">
                    <SupportButton
                      variant="outline"
                      className="w-full"
                    >
                      Get Help
                    </SupportButton>

                    {/* Mobile anonymous buttons */}
                    <Button
                      variant="outline"
                      className="w-full"
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
                      className="w-full bg-red-600 hover:bg-red-700"
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
                      className="w-full"
                      data-o-authenticated
                      onClick={() => {
                        setMobileMenuOpen(false);
                        window.location.href = '/members';
                      }}
                    >
                      Dashboard
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
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