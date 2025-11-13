import React from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Heart, Shield, Users, Target, Award, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Compliance First",
      description: (
        <>
          Ensuring healthcare providers stay compliant with evolving telehealth regulations
        </>
      )
    },
    {
      icon: Heart,
      title: "Patient Care",
      description: "Enabling accessible healthcare during disasters and emergencies"
    },
    {
      icon: Users,
      title: "Provider Support",
      description: "Simplifying complex regulations for healthcare professionals"
    }
  ];

  const stats = [
    { label: "Healthcare Providers", value: "1,000+", description: "Trusted by professionals across Australia" },
    { label: "Postcodes Monitored", value: "4,000+", description: "Complete Australian coverage" },
    { label: "Disaster Events Tracked", value: "50+", description: "Real-time monitoring since 2024" },
    { label: "Compliance Rate", value: "99.9%", description: "Accurate verification tracking" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="scroll-reveal max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <Badge variant="secondary" className="mb-4">
              <Globe className="h-4 w-4 mr-2" />
              Our Story
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text">About TeleCheck</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              Empowering Australian healthcare providers with reliable telehealth compliance tools
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <Card className="floating-tile animate-float">
              <CardHeader>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  TeleCheck was founded to address the growing complexity of telehealth regulations in Australia. 
                  During disasters and emergencies, healthcare providers need quick, reliable verification of
                  telehealth eligibility to serve patients effectively.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We believe that compliance shouldn't be a barrier to patient care. Our platform simplifies
                  the verification process, allowing healthcare providers to focus on what matters most -
                  delivering quality care to their patients.
                </p>
              </CardContent>
            </Card>

            <Card className="floating-tile animate-float" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="text-2xl">Why We Built This</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Australian healthcare providers faced challenges keeping up with changing disaster declarations
                  and telehealth eligibility. Manual checking was time-consuming and error-prone, potentially
                  impacting both patient care and billing compliance.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  TeleCheck automates this process with real-time monitoring and instant verification,
                  ensuring providers can confidently deliver telehealth services when and where they're needed most.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="floating-tile text-center hover:animate-glow">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-glow flex items-center justify-center mb-4">
                      <value.icon className="h-8 w-8" />
                    </div>
                    <CardTitle>{value.title}</CardTitle>
                    <CardDescription className="text-center">{value.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Our Coverage</h2>
            <Card className="floating-tile text-center p-8">
              <CardHeader>
                <CardTitle className="text-2xl">Supporting telehealth and mixed clinics Australia-wide</CardTitle>
                <CardDescription className="text-base">We support practices across every state and territory with reliable compliance tools — no vanity numbers, just nationwide support.</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card className="floating-tile bg-gradient-glow p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Award className="h-8 w-8" />
              <h3 className="text-2xl font-bold">Trusted by Healthcare Professionals</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              TeleCheck is built by healthcare technology experts who understand the unique challenges 
              of Australian healthcare delivery. We're committed to maintaining the highest standards 
              of accuracy, security, and reliability in all our services.
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};