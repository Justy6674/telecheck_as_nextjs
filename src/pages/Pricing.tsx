import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, Users, Code, Activity, Shield, ArrowRight } from "lucide-react";
import { SubscribeButton } from "@/components/SubscribeButton";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Pricing = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="container mx-auto px-4 text-center">
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text-practitioner">Simple, Transparent Pricing</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Subscribe for unlimited Medicare disaster telehealth eligibility verifications.
            Individual subscriptions available now.
          </p>
        </div>
      </section>

      {/* Simple Pricing - Just a Button */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl">TeleCheck Professional</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                For ONE INDIVIDUAL PRACTITIONER or ONE CLINIC with ONE PRACTITIONER
              </p>
              <div className="text-4xl font-bold mt-4">$56.81 <span className="text-lg font-normal">AUD/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-left space-y-2">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Unlimited disaster verifications</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Clinic analysis (up to 10,000 patient postcodes)</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Real-time Medicare compliance</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Full audit trail logging</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Email support</li>
              </ul>
              
              {/* Subscribe button - shown when logged out */}
              <Button
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700"
                data-o-anonymous
                data-o-auth="1"
                data-mode="popup"
                data-widget-mode="register"
                data-plan-uid="pWrbAMWn"
                data-skip-plan-options="true"
              >
                Subscribe Now - $56.81 AUD/month
              </Button>

              {/* Dashboard button - shown when logged in */}
              <Button
                size="lg"
                className="w-full"
                data-o-authenticated
                onClick={() => window.location.href = '/members'}
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
          
          {/* Coming Soon Info Cards */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">

            {/* Practice Plan - Coming Soon */}
            <Card className="border shadow-lg relative opacity-75">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge variant="secondary" className="px-4 py-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Coming Soon
                </Badge>
              </div>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl font-bold">Practice Wide</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">$199</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  For small to medium practices (up to 10 users)
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                   <li className="flex items-center gap-3">
                     <Check className="h-5 w-5 text-success" />
                     <span>Everything in Individual</span>
                   </li>
                   <li className="flex items-center gap-3">
                     <Check className="h-5 w-5 text-success" />
                     <span>Up to 10 users</span>
                   </li>
                   <li className="flex items-center gap-3">
                     <Check className="h-5 w-5 text-success" />
                     <span>Admin dashboard</span>
                   </li>
                   <li className="flex items-center gap-3">
                     <Check className="h-5 w-5 text-success" />
                     <span>User management</span>
                   </li>
                   <li className="flex items-center gap-3">
                     <Check className="h-5 w-5 text-success" />
                     <span>Usage analytics</span>
                   </li>
                   <li className="flex items-center gap-3">
                     <Check className="h-5 w-5 text-success" />
                     <span>Priority support</span>
                   </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full mt-6"
                  size="lg"
                  disabled
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan - Coming Soon */}
            <Card className="border shadow-lg relative opacity-75">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge variant="secondary" className="px-4 py-1">
                  <Clock className="h-3 w-3 mr-1" />
                  Coming Soon
                </Badge>
              </div>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">Custom</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  For large practices and healthcare networks
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                   <li className="flex items-center gap-3">
                     <Check className="h-5 w-5 text-success" />
                     <span>Everything in Practice Wide</span>
                   </li>
                   <li className="flex items-center gap-3">
                     <Check className="h-5 w-5 text-success" />
                     <span>Unlimited users</span>
                   </li>
                   <li className="flex items-center gap-3">
                     <Check className="h-5 w-5 text-success" />
                     <span>Multi-clinic support</span>
                   </li>
                   <li className="flex items-center gap-3">
                     <Check className="h-5 w-5 text-success" />
                     <span>Advanced analytics</span>
                   </li>
                   <li className="flex items-center gap-3">
                     <Check className="h-5 w-5 text-success" />
                     <span>Custom integrations</span>
                   </li>
                   <li className="flex items-center gap-3">
                     <Check className="h-5 w-5 text-success" />
                     <span>Dedicated support</span>
                   </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full mt-6"
                  size="lg"
                  disabled
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* API Integration Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-background rounded-full border mb-6">
              <Code className="h-4 w-4" />
              <Badge variant="secondary">Coming Soon</Badge>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              API Integration for Booking Software
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Seamlessly integrate TeleCheck verification directly into your existing 
              practice management and booking systems.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">RESTful API</h3>
                  <p className="text-sm text-muted-foreground">
                    Simple REST endpoints for real-time verification
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-success" />
                  </div>
                  <h3 className="font-semibold mb-2">Multi-Platform</h3>
                  <p className="text-sm text-muted-foreground">
                    Compatible with major booking software platforms
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Code className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">Easy Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive documentation and SDKs
                  </p>
                </CardContent>
              </Card>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              Interested in API access? Get notified when it becomes available.
            </p>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open('mailto:support@telecheck.com.au?subject=API Access Interest', '_blank')}
            >
              <Clock className="mr-2 h-4 w-4" />
              Notify Me About API Access
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Who is the Professional subscription for?</h3>
                <p className="text-muted-foreground">
                  <strong>Professional ($56.81 AUD/month)</strong> is designed for <strong>ONE INDIVIDUAL PRACTITIONER</strong> or <strong>ONE CLINIC with ONE PRACTITIONER</strong>.
                  You get unlimited disaster verifications, clinic analysis for up to 10,000 patient postcodes, and full audit trails.
                  Each postcode represents one patient's address with no deduplication.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">When will practice-wide plans be available?</h3>
                <p className="text-muted-foreground">
                  Practice-wide plans with admin features and user management are currently 
                  in development. Sign up for individual access to be notified when they launch.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Will there be API integration?</h3>
                <p className="text-muted-foreground">
                  Yes! We're developing REST API endpoints to integrate TeleCheck verification 
                  directly into existing practice management and booking software systems.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Is the data real-time?</h3>
                <p className="text-muted-foreground">
                  Absolutely. TeleCheck connects directly to DisasterAssist.gov.au and other 
                  Australian government sources to provide real-time disaster declaration data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
