"use client";

import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Play, MapPin, CheckCircle, FileCheck, Clock, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const HowToUse = () => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  
  const steps = [
    {
      icon: MapPin,
      title: "Enter Postcode",
      description: "Input the patient's postcode to check disaster status",
      details: ["4-digit Australian postcode", "Real-time verification", "Instant results"],
      type: "practitioner"
    },
    {
      icon: CheckCircle,
      title: "Review Status",
      description: "Check if telehealth services are available in that area",
      details: ["Disaster declaration status", "Telehealth eligibility", "MBS compliance info"],
      type: "mixed"
    },
    {
      icon: FileCheck,
      title: "Document & Bill",
      description: "Proceed with compliant telehealth consultation",
      details: ["Use appropriate MBS items", "Document disaster impact", "Maintain patient records"],
      type: "practitioner"
    }
  ];

  const features = [
    {
      title: "Real-time Verification",
      description: "Check disaster status instantly with government data",
      icon: Clock,
      type: "practitioner"
    },
    {
      title: "MBS Compliance",
      description: "Ensure billing compliance with latest regulations",
      icon: FileCheck,
      type: "practitioner"
    },
    {
      title: "24/7 Monitoring",
      description: "Continuous updates on disaster declarations",
      icon: Users,
      type: "practitioner"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="scroll-reveal max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <Badge variant="secondary" className="mb-4">
              <Play className="h-4 w-4 mr-2" />
              Getting Started
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text-practitioner">How to Use TeleCheck</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Simple, fast verification for compliant telehealth services during disasters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 md:mb-16">
            {steps.map((step, index) => (
              <Card key={index} className="floating-tile animate-float" style={{ animationDelay: `${index * 0.3}s` }}>
                <CardHeader className="text-center p-5 sm:p-6">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-glow">
                    <step.icon className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <div className="text-sm font-medium mb-2">Step {index + 1}</div>
                  <CardTitle className="text-lg sm:text-xl">{step.title}</CardTitle>
                  <CardDescription className="text-sm sm:text-base">{step.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-5 sm:p-6">
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Screenshot Showcase Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">
                <FileCheck className="h-4 w-4 mr-2" />
                What You Get
              </Badge>
              <h2 className="text-3xl font-bold mb-4">See TeleCheck in Action</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore the powerful features and intuitive interface that makes telehealth verification simple and compliant
              </p>
            </div>

            <div className="space-y-12">
              {/* Member Dashboard */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4 gradient-text-practitioner">Member Dashboard</h3>
                  <p className="text-muted-foreground mb-6">
                    Access your personalized dashboard with quick verification tools, saved checks, and account management all in one place.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Quick postcode verification</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Recent checks history</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Account settings and preferences</span>
                    </li>
                  </ul>
                </div>
                <Card className="floating-tile">
                  <CardContent className="p-0">
                    <img 
                      src="https://pkixezdlbmzntwekchoq.supabase.co/storage/v1/object/public/Website%20Images/Dashboard.png" 
                      alt="TeleCheck Member Dashboard showing quick postcode verification, recent checks history, and account settings"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Postcode Check Example */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <Card className="floating-tile md:order-1">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden">
                      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                        <img 
                          src="https://pkixezdlbmzntwekchoq.supabase.co/storage/v1/object/public/Website%20Images/PostCodeSearch.png" 
                          alt="TeleCheck real-time postcode verification showing disaster status and telehealth eligibility results"
                          className="w-full h-auto object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="md:order-2">
                  <h3 className="text-2xl font-bold mb-4 gradient-text-practitioner">Real-Time Verification</h3>
                  <p className="text-muted-foreground mb-6">
                    See exactly how postcode verification works with instant results showing disaster status and telehealth eligibility.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Instant disaster status checking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">MBS compliance information</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Clear eligibility indicators</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Proforma/Report Example */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4 gradient-text-practitioner">Customizable Reports</h3>
                  <p className="text-muted-foreground mb-6">
                    Generate professional reports and proformas that you can customize for your practice needs and compliance requirements.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Professional report templates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Editable proforma fields</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">PDF export and printing</span>
                    </li>
                  </ul>
                </div>
                <Card className="floating-tile">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden">
                      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                        <img 
                          src="https://pkixezdlbmzntwekchoq.supabase.co/storage/v1/object/public/Website%20Images/ClinReportPDF.png" 
                          alt="TeleCheck customizable clinic report showing professional PDF template with editable fields and compliance information"
                          className="w-full h-auto object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Save to Dashboard Feature */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <Card className="floating-tile md:order-1">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden">
                      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                        <img 
                          src="https://pkixezdlbmzntwekchoq.supabase.co/storage/v1/object/public/Website%20Images/savedchecks.png" 
                          alt="TeleCheck dashboard showing saved verification results with historical check tracking and quick access to past results"
                          className="w-full h-auto object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="md:order-2">
                  <h3 className="text-2xl font-bold mb-4 gradient-text-practitioner">Save & Track Checks</h3>
                  <p className="text-muted-foreground mb-6">
                    Save important verification results to your dashboard for easy reference and maintain a complete audit trail of your checks.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Save verification results</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Historical check tracking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Quick access to past results</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Link Verification */}
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4 gradient-text-practitioner">Link Verification</h3>
                  <p className="text-muted-foreground mb-6">
                    Verify official government links and ensure you're accessing the most current and accurate disaster declaration information.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Government source verification</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Real-time link validation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Secure access to official data</span>
                    </li>
                  </ul>
                </div>
                <Card className="floating-tile">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden">
                      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                        <img 
                          src="https://pkixezdlbmzntwekchoq.supabase.co/storage/v1/object/public/Website%20Images/disasterlinks.png" 
                          alt="TeleCheck link verification showing government source validation, real-time link checking, and secure access to official disaster data"
                          className="w-full h-auto object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Clinic Analysis */}
              <div className="text-center">
                <Card className="floating-tile inline-block max-w-4xl mx-auto">
                  <CardHeader>
                    <CardTitle className="text-2xl gradient-text-practitioner">Comprehensive Clinic Analysis</CardTitle>
                    <CardDescription className="text-base">
                      Get detailed analysis of your clinic's telehealth usage patterns and compliance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Image Carousel */}
                    <div className="relative mb-6">
                      <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg overflow-hidden">
                        <div 
                          className="flex transition-transform duration-300 ease-in-out h-full"
                          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                        >
                          {/* Image 1: Data Upload Screen */}
                          <div className="w-full flex-shrink-0 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                            <img 
                              src="https://pkixezdlbmzntwekchoq.supabase.co/storage/v1/object/public/Website%20Images/ClinicReportDataUploadScreen.png" 
                              alt="TeleCheck clinic analysis data upload screen showing file upload interface for bulk patient postcode analysis"
                              className="w-full h-auto object-contain"
                              loading="lazy"
                            />
                          </div>
                          {/* Image 2: State Distribution (Long - Scrollable) */}
                          <div className="w-full flex-shrink-0 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                            <img 
                              src="https://pkixezdlbmzntwekchoq.supabase.co/storage/v1/object/public/Website%20Images/CliniReportStates%20(1).png" 
                              alt="TeleCheck clinic analysis comprehensive state distribution showing detailed breakdown by state with remoteness categories and eligibility counts - scroll to view all states"
                              className="w-full h-auto object-contain"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Navigation Arrows */}
                      <button 
                        onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-full transition-colors"
                        aria-label="Previous image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => setCurrentImageIndex(prev => prev < 1 ? prev + 1 : 0)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-full transition-colors"
                        aria-label="Next image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      {/* Navigation Dots */}
                      <div className="flex justify-center space-x-2 mt-4">
                        {[0, 1].map((index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              currentImageIndex === index 
                                ? 'bg-blue-500' 
                                : 'bg-slate-400 hover:bg-slate-300'
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                      
                      {/* Image Labels */}
                      <div className="text-center mt-2">
                        <p className="text-sm text-muted-foreground">
                          {currentImageIndex === 0 && "Data Upload Interface"}
                          {currentImageIndex === 1 && "Complete State Analysis (Scroll to View All)"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>Usage analytics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>Compliance tracking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>Performance insights</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="floating-tile hover:animate-glow">
                  <CardHeader className="text-center">
                    <feature.icon className="h-12 w-12 mx-auto mb-4" />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Card className="floating-tile bg-gradient-glow inline-block p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Join healthcare providers across Australia using TeleCheck for compliant telehealth services.
              </p>
              <Button size="lg" className="gradient-text">
                Start Verification
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowToUse;