"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, CheckCircle, AlertTriangle, FileText, Clock, ExternalLink, Calendar, Users, Phone, Video } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { telehealthRulesData, disasterProvisions } from "@/data/mbs-telehealth";

export const TelehealthRules = () => {
  const [activeTab, setActiveTab] = useState("medical");
  
  interface Exemption {
    title: string;
    description: string;
    details?: string;
  }

  const ExemptionCard = ({ exemption }: { exemption: Exemption }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-success" />
          {exemption.title}
        </CardTitle>
        <CardDescription>{exemption.description}</CardDescription>
      </CardHeader>
      {exemption.details && (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground">{exemption.details}</p>
        </CardContent>
      )}
    </Card>
  );
  
  const QuickCheckCard = () => (
    <Card className="mb-8 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Exemption Quick Check
        </CardTitle>
        <CardDescription>
          These patients are exempt from the 12-month established clinical relationship requirement:
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            Children under 12 months
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            People who are homeless
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            AMS/ACCHS patients
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            COVID isolation/quarantine
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            Natural disaster affected areas
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            Blood Borne Virus & Sexual/Reproductive Health consultations
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="scroll-reveal max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <Badge variant="secondary" className="mb-4">
              <Shield className="h-4 w-4 mr-2" />
              MBS Compliance Guide
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="gradient-text">Telehealth Rules</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Current Australian Medicare telehealth regulations for medical practitioners and nurse practitioners
            </p>
          </div>

          <QuickCheckCard />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
              <TabsTrigger value="medical" className="text-xs sm:text-sm">Medical Practitioners</TabsTrigger>
              <TabsTrigger value="nurse" className="text-xs sm:text-sm">Nurse Practitioners</TabsTrigger>
            </TabsList>

            {Object.entries(telehealthRulesData).map(([key, rules]) => (
              <TabsContent key={key} value={key} className="space-y-8">
                {rules.establishedRelationship.effectiveDate && (
                  <Card className="border-amber-500/20 bg-amber-500/5">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5 text-amber-500" />
                        <span className="font-semibold text-amber-700 dark:text-amber-300">
                          Effective {rules.establishedRelationship.effectiveDate}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        New clinical relationship requirements for Nurse Practitioners come into effect on this date.
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Card className="floating-tile">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Established Clinical Relationship
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground">{rules.establishedRelationship.requirement}</p>
                    <p className="text-sm text-muted-foreground">{rules.establishedRelationship.details}</p>
                  </CardContent>
                </Card>

                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-success" />
                    Current Exemptions
                  </h2>
                  <div className="grid gap-4">
                    {rules.exemptions.map((exemption, index) => (
                      <ExemptionCard key={index} exemption={exemption} />
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        Video Consultations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{rules.modalities.video}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Phone Consultations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{rules.modalities.phone}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Documentation Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-success mt-1" />
                        <span className="text-sm text-muted-foreground">{rules.documentation.consent}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-success mt-1" />
                        <span className="text-sm text-muted-foreground">{rules.documentation.identity}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-success mt-1" />
                        <span className="text-sm text-muted-foreground">{rules.documentation.clinical}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-success mt-1" />
                        <span className="text-sm text-muted-foreground">{rules.documentation.records}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Geographic & Disaster Provisions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Geographic Restrictions</h4>
                        <p className="text-sm text-muted-foreground">{rules.geographic.restrictions}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Natural Disaster Provisions</h4>
                        <p className="text-sm text-muted-foreground">{rules.geographic.disaster}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Official Sources
                    </CardTitle>
                    <CardDescription>
                      Last updated: {rules.lastUpdated}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {rules.sources.map((source, index) => (
                        <a 
                          key={index}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm hover:underline transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" />
                          {source.title}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

          <Card className="mt-16 floating-tile border-amber-500/20 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                {disasterProvisions.title}
              </CardTitle>
              <CardDescription>{disasterProvisions.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Special Provisions Include:</h4>
                  <div className="space-y-2">
                    {disasterProvisions.details.map((detail, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">Activation Trigger</h4>
                    <p className="text-sm text-muted-foreground">{disasterProvisions.trigger}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-sm">Duration</h4>
                    <p className="text-sm text-muted-foreground">{disasterProvisions.duration}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-16 p-8 floating-tile animate-glow">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Important Compliance Note</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              TeleCheck provides verification tools to help ensure compliance with telehealth regulations. 
              However, healthcare providers remain responsible for understanding and adhering to all applicable 
              laws, regulations, and professional standards. Always consult official MBS guidelines and seek 
              professional advice when needed. This information is current as of December 2024.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};