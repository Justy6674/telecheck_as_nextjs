import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Info, CheckCircle, ChevronDown, ChevronUp, DollarSign, Printer, Download } from "lucide-react";
import DisasterExemptionNote from "@/components/DisasterExemptionNote";

interface DisasterInfo {
  agrn: string;
  title: string;
  hazard_type: string;
  start_date: string;
  end_date: string | null;
}

interface EligibilityResult {
  is_eligible: boolean;
  postcode: string;
  suburb: string;
  state: string;
  affected_lga: string;
  lga_code: string;
  total_disasters: number;
  disasters: DisasterInfo[];
}

const PatientEligibilityChecker = () => {
  const [providerType, setProviderType] = useState<string>("");
  const [postcode, setPostcode] = useState<string>("");
  const [lastVisit, setLastVisit] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disasterResults, setDisasterResults] = useState<EligibilityResult[] | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false);
  const [isOtherExemptionsExpanded, setIsOtherExemptionsExpanded] = useState<boolean>(false);
  

  const checkPostcode = async () => {
    if (!postcode) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.rpc('check_telehealth_eligibility_v2', {
        check_postcode: postcode
      });
      
      if (error) {
        console.error('Error checking postcode:', error);
        return;
      }
      
      setDisasterResults(data ? data.map((result: any) => ({
        ...result,
        disasters: typeof result.disasters === 'string' ? JSON.parse(result.disasters) : result.disasters || []
      })) : null);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckEligibility = () => {
    checkPostcode();
    setShowResults(true);
  };

  const generateReportData = () => {
    if (!disasterResults || disasterResults.length === 0) {
      return {
        postcode,
        hasDisaster: false,
        message: "No current disaster declarations found for your area.",
        practitionerNote: "Patient requires assessment for other telehealth eligibility criteria per standard Medicare guidelines."
      };
    }

    const result = disasterResults[0];
    const disaster = result.disasters[0];
    
    return {
      postcode: result.postcode,
      suburb: result.suburb,
      state: result.state,
      lga: result.affected_lga,
      hasDisaster: true,
      disaster: {
        agrn: disaster.agrn,
        title: disaster.title,
        hazardType: disaster.hazard_type,
        startDate: disaster.start_date,
        endDate: disaster.end_date || 'Ongoing'
      },
      practitionerNote: `Patient is in a disaster-declared area. Consider Medicare telehealth exemption eligibility.`,
      officialLink: `https://www.disasterassist.gov.au/disaster/${disaster.agrn}`
    };
  };

  const handlePrintReport = () => {
    const reportData = generateReportData();
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>TeleCheck Report - ${reportData.postcode}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
            .header { border-bottom: 2px solid #dc2626; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 15px; }
            .label { font-weight: bold; }
            .disaster-info { background: #fef2f2; padding: 10px; border-left: 4px solid #dc2626; margin: 10px 0; }
            .practitioner-notes { background: #f8fafc; padding: 15px; border: 1px solid #e2e8f0; margin: 15px 0; }
            .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 0.9em; color: #666; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TeleCheck Verification Report</h1>
            <p>Generated: ${new Date().toLocaleDateString('en-AU')} at ${new Date().toLocaleTimeString('en-AU')}</p>
          </div>
          
          <div class="section">
            <span class="label">Postcode:</span> ${reportData.postcode}
            ${reportData.suburb ? `<br><span class="label">Location:</span> ${reportData.suburb}, ${reportData.state}` : ''}
            ${reportData.lga ? `<br><span class="label">Local Government Area:</span> ${reportData.lga}` : ''}
          </div>

          ${reportData.hasDisaster ? `
            <div class="disaster-info">
              <h3>⚠️ Active Disaster Declaration</h3>
              <p><span class="label">AGRN:</span> ${reportData.disaster.agrn}</p>
              <p><span class="label">Declaration:</span> ${reportData.disaster.title}</p>
              <p><span class="label">Hazard Type:</span> ${reportData.disaster.hazardType}</p>
              <p><span class="label">Start Date:</span> ${reportData.disaster.startDate}</p>
              <p><span class="label">End Date:</span> ${reportData.disaster.endDate}</p>
              <p><span class="label">Official Details:</span> <a href="${reportData.officialLink}" target="_blank">${reportData.officialLink}</a></p>
            </div>
          ` : `
            <div class="section">
              <p>${reportData.message}</p>
            </div>
          `}

          <div class="practitioner-notes">
            <h3>Clinical Notes</h3>
            <p><strong>Assessment Required:</strong> ${reportData.practitionerNote}</p>
            <p><strong>Telehealth Eligibility:</strong> Consider telehealth services if disaster exemption applies.</p>
            <p><strong>Documentation:</strong> Record assessment of telehealth eligibility criteria in <span className="text-role-consumer">patient</span> notes.</p>
            <br>
            <p><em>Space for practitioner notes:</em></p>
            <div style="border: 1px solid #ccc; height: 100px; margin-top: 10px;"></div>
          </div>

          <div class="footer">
            <p><strong>Important:</strong> This report provides verification data only. Healthcare practitioners remain responsible for clinical assessment and Medicare compliance.</p>
            <p>Generated by TeleCheck - Australian telehealth disaster verification platform</p>
            <p>For support: support@telecheck.com.au</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const renderDisasterResults = () => {
    if (!disasterResults || disasterResults.length === 0) {
      return (
        <p className="text-sm text-muted-foreground">
          {postcode ? `ℹ️ No current disaster declaration for ${postcode}. Your provider will consider other circumstances if applicable.` : "Enter postcode above to check for disaster declarations"}
        </p>
      );
    }

    const result = disasterResults[0];
    if (result.total_disasters > 0) {
      return (
        <div className="space-y-2">
          <Alert className="border-2 border-success/40 bg-success/10 shadow-sm">
            <AlertTriangle className="h-4 w-4 text-success" />
            <AlertDescription>
              <strong>⚠️ POSSIBLE DISASTER CONSIDERATION</strong>
              <br />
              Your postcode {result.postcode} is in an area affected by:
              <br />
              <strong>{result.disasters[0].title}</strong> - Declared {result.disasters[0].start_date}
              <br /><br />
              This MAY be relevant to Medicare telehealth eligibility. Your provider will assess if this applies to your consultation.
              <br /><br />
              When contacting the practice:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Mention you're in a disaster-declared area</li>
                <li>Ask if they use TeleCheck for verification</li>
                <li>The provider will determine if exemption applies</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return (
      <Alert className="border-2 border-destructive/40 bg-destructive/10 shadow-sm">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription>
          ℹ️ No current disaster declaration for {result.postcode}. Your provider will consider other circumstances if applicable.
        </AlertDescription>
      </Alert>
    );
  };

  const renderResults = () => {
    if (!showResults) return null;

    // If they've had a recent visit
    if (lastVisit === "yes") {
      return (
        <Card className="mt-6 border-success bg-success/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium text-success-foreground">
                  ✅ You generally meet standard Medicare telehealth requirements.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your <span className="text-role-practitioner">practitioner</span> will handle Medicare billing. Discuss your consultation needs during booking or at the start of your appointment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // If they haven't had a recent visit or are unsure
    if (lastVisit === "no" || lastVisit === "not-sure") {
      return (
        <Card className="mt-6 border-muted">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              📋 MEDICARE TELEHEALTH GUIDELINES - GENERAL INFORMATION
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                The Department of Health requires a 12-month in-person visit for Medicare telehealth rebates [current for <span className="text-role-practitioner">GPs</span>, from 1 November 2025 for NPs].
                <br /><br />
                <strong>HOWEVER, certain circumstances MAY allow exemptions. Your healthcare provider will assess if your situation qualifies.</strong>
              </AlertDescription>
            </Alert>

            {/* Private Fee Notice */}
            <Alert className="border-2 border-blue-500/50 bg-blue-50 dark:border-blue-500/40 dark:bg-blue-950 shadow-sm">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800 dark:text-blue-200">Important: Medicare Billing Information</AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                Your healthcare <span className="text-role-practitioner">practitioner</span> handles all Medicare billing, not you. If you don't meet Medicare telehealth eligibility requirements, your practice may charge a private fee. Discuss fees and eligibility with your healthcare provider when booking.
              </AlertDescription>
            </Alert>

            <Collapsible open={isDetailsExpanded} onOpenChange={setIsDetailsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-card border-border hover:bg-muted hover:border-blue-500/40 min-h-[48px] text-sm sm:text-base">
                  {isDetailsExpanded ? "Hide Details" : "Show Eligibility Details"}
                  {isDetailsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-6 mt-4">
                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    🏥 CIRCUMSTANCES THAT MAY QUALIFY FOR EXEMPTIONS:
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your provider will consider if your consultation involves:
                  </p>
                  
                  <div className="space-y-3 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-blue-500 font-medium text-lg">1️⃣</span>
                      <div>
                        <strong>CHILDREN UNDER 12 MONTHS</strong>
                        <p className="text-sm text-muted-foreground">The provider will verify the child's age</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-blue-500 font-medium text-lg">2️⃣</span>
                      <div>
                        <strong>HOMELESSNESS</strong>
                        <p className="text-sm text-muted-foreground">The provider will assess accommodation circumstances</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-blue-500 font-medium text-lg">3️⃣</span>
                      <div>
                        <strong>ABORIGINAL HEALTH SERVICES</strong>
                        <p className="text-sm text-muted-foreground">The provider will confirm service eligibility</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-blue-500 font-medium text-lg">4️⃣</span>
                      <div>
                        <strong>COVID-19 REQUIREMENTS</strong>
                        <p className="text-sm text-muted-foreground">The provider will verify current health orders</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-blue-500 font-medium text-lg">5️⃣</span>
                      <div className="text-center">
                        <strong>NATURAL DISASTERS</strong>
                        <div className="mt-2">
                          {renderDisasterResults()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-blue-500 font-medium text-lg">6️⃣</span>
                      <div>
                        <strong>SENSITIVE HEALTH MATTERS (BBVSRH)</strong>
                        <p className="text-sm text-muted-foreground">
                          The Medicare BBVSRH exemption covers certain sensitive health consultations. Your provider will determine if your consultation qualifies based on clinical assessment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    📍 WHAT TO DISCUSS WITH YOUR PROVIDER:
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    The following MAY be considered under exemptions, but your provider must assess each case individually:
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">AREAS YOUR PROVIDER MAY CONSIDER:</h4>
                    </div>

                    <div>
                      <h5 className="font-medium text-blue-500">Blood-Borne Viruses:</h5>
                      <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-1">
                        <li>HIV, Hepatitis B/C, and related conditions</li>
                        <li>Your provider determines if consultation qualifies</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium text-blue-500">Sexual & Reproductive Health (broadly interpreted):</h5>
                      <p className="text-sm text-muted-foreground mb-2">Your provider may consider consultations involving:</p>
                      
                      <div className="ml-4 space-y-3">
                        <div>
                          <h6 className="font-medium">• Women's health concerns such as:</h6>
                          <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-1">
                            <li>PCOS, endometriosis, fibroids</li>
                            <li>Menopause and related symptoms</li>
                            <li>Period concerns or irregularities</li>
                            <li>Fertility discussions</li>
                            <li>Contraception needs</li>
                            <li>Pregnancy-related consultations</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h6 className="font-medium">• Men's health concerns such as:</h6>
                          <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-1">
                            <li>Erectile dysfunction (various causes)</li>
                            <li>Testosterone concerns</li>
                            <li>Fertility issues</li>
                            <li>Prostate health</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h6 className="font-medium">• Weight-related health impacts:</h6>
                          <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-1">
                            <li>Sexual function affected by weight</li>
                            <li>PCOS management</li>
                            <li>Fertility and weight relationships</li>
                            <li>Hormonal impacts</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h6 className="font-medium">• Other sensitive matters:</h6>
                          <ul className="list-disc list-inside text-sm text-muted-foreground ml-4 space-y-1">
                            <li>STI concerns or testing</li>
                            <li>Gender-affirming care</li>
                            <li>Sexual health at any age</li>
                            <li>Medication effects on sexual function</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert className="mt-4 border-2 border-blue-500/30 bg-blue-50/10 shadow-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>IMPORTANT NOTES:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>⚠️ This list is NOT exhaustive or definitive</li>
                        <li>⚠️ Your provider assesses EACH consultation individually</li>
                        <li>⚠️ Clinical judgment always applies</li>
                        <li>⚠️ Not all consultations for these conditions may qualify</li>
                        <li>⚠️ Additional circumstances may also qualify</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">WHAT TO DO NEXT:</h3>
                  <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-role-consumer">1. CONTACT YOUR <span className="text-role-practitioner">PRACTITIONER'S</span> OFFICE</h4>
                  <p className="text-sm text-muted-foreground ml-4">
                    "I'd like to book a telehealth appointment. Can we discuss my eligibility during the consultation?"
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-role-consumer">2. DISCUSS WITH RECEPTION/<span className="text-role-consumer">ADMINISTRATION</span></h4>
                  <p className="text-sm text-muted-foreground ml-4 mb-2">They can often provide initial guidance about:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-8 space-y-1">
                    <li>Whether your circumstances might qualify</li>
                    <li>What information the <span className="text-role-practitioner">practitioner</span> needs</li>
                    <li>Consultation fees if Medicare doesn't apply</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-blue-500">3. BE PREPARED TO DISCUSS:</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground ml-8 space-y-1">
                        <li>Your health concern (in general terms)</li>
                        <li>Your last in-person visit date</li>
                        <li>Any relevant circumstances from above</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-blue-500">4. ASK ABOUT:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground ml-8 space-y-1">
                        <li>Whether the practice uses TeleCheck or similar verification</li>
                        <li>Private billing options if Medicare doesn't apply</li>
                        <li>Whether an initial in-person visit would help</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Alert className="border-2 border-blue-500/40 bg-destructive/5 shadow-sm">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <AlertDescription>
                    <strong>⚠️ ESSENTIAL INFORMATION:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                      <li>This tool provides GENERAL GUIDANCE ONLY</li>
                      <li>Your healthcare provider makes ALL eligibility determinations</li>
                      <li>Clinical discretion ALWAYS applies</li>
                      <li>Medicare rules are complex - providers interpret them case-by-case</li>
                      <li>Even if you think you qualify, the provider must agree</li>
                      <li>Providers consider clinical need, safety, and appropriateness</li>
                      <li>Reception staff can guide but cannot guarantee eligibility</li>
                      <li>Private (non-Medicare) consultations may be available</li>
                    </ul>
                    <p className="mt-3 text-sm">
                      This tool reflects general Medicare guidelines. Individual circumstances vary. Always discuss your specific situation with your healthcare provider or their <span className="text-role-consumer">administration</span> team.
                    </p>
                    <p className="mt-2 text-sm">
                      Many practices use professional verification systems like TeleCheck to ensure compliance with current Medicare requirements.
                    </p>
                  </AlertDescription>
                </Alert>
              </CollapsibleContent>
            </Collapsible>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* What's Changed Banner */}
          <Alert className="mb-8 border-2 border-blue-500/60 bg-background/90 text-foreground shadow-lg backdrop-blur">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-foreground">
              <strong className="text-foreground">What's Changed:</strong> Medicare telehealth rules have been updated. From 1 November 2025, Nurse <span className="text-role-practitioner">Practitioners</span> will also require a 12-month in-person visit requirement (like <span className="text-role-practitioner">GPs</span> already do). This tool helps you understand the current requirements and exemptions.
            </AlertDescription>
          </Alert>

          <Card className="border-blue-500/20 bg-background/50 backdrop-blur-sm">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl font-bold text-center">
                Medicare Telehealth Eligibility Guide - Check Your Circumstances
              </CardTitle>
              <p className="text-center text-foreground text-sm md:text-base font-medium">
                <strong>For <span className="text-role-consumer">consumers</span> — share these details with your <span className="text-role-practitioner">practitioner</span></strong>
                <br />
                This tool provides general guidance based on Federal Government Medicare requirements.
                <br />
                <strong>Your healthcare provider always makes the final determination based on clinical need.</strong>
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6 px-4 sm:px-6">
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">1. Select your healthcare provider type:</Label>
                  <RadioGroup value={providerType} onValueChange={setProviderType} className="mt-3 space-y-3">
                    <div className="flex items-center space-x-3 p-4 border-3 border-blue-500/30 hover:border-blue-500/70 rounded-xl bg-card/80 hover:bg-card shadow-md hover:shadow-lg transition-all cursor-pointer min-h-[56px]">
                      <RadioGroupItem value="gp" id="gp" className="border-2 border-blue-500 scale-125 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
                      <Label htmlFor="gp" className="cursor-pointer flex-1 font-semibold text-sm sm:text-base">GP (General <span className="text-white">Practitioner</span>)</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-3 border-blue-500/30 hover:border-blue-500/70 rounded-xl bg-card/80 hover:bg-card shadow-md hover:shadow-lg transition-all cursor-pointer min-h-[56px]">
                      <RadioGroupItem value="np" id="np" className="border-2 border-blue-500 scale-125 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
                      <Label htmlFor="np" className="cursor-pointer flex-1 font-semibold text-sm sm:text-base">Nurse <span className="text-white">Practitioner</span></Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-3 border-blue-500/30 hover:border-blue-500/70 rounded-xl bg-card/80 hover:bg-card shadow-md hover:shadow-lg transition-all cursor-pointer min-h-[56px]">
                      <RadioGroupItem value="other" id="other" className="border-2 border-blue-500 scale-125 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
                      <Label htmlFor="other" className="cursor-pointer flex-1 font-semibold text-sm sm:text-base">Other Healthcare Provider</Label>
                    </div>
                  </RadioGroup>
                  
                  <Alert className="mt-3 border-2 border-blue-500/30 bg-blue-50/10 shadow-sm">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>Note about Specialists:</strong> Most medical specialists are not subject to the 12-month in-person visit requirement for Medicare telehealth consultations. However, you should confirm this with your specialist's office as individual circumstances may vary.
                    </AlertDescription>
                  </Alert>
                </div>

                {/* Postcode Check - First Priority */}
                <div>
                  <Label htmlFor="postcode" className="text-base font-medium">Check for Natural Disaster Exemption First:</Label>
                  <div className="flex flex-col sm:flex-row gap-3 mt-3">
                    <Input
                      id="postcode"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      placeholder="Enter your postcode"
                      className="flex-1 sm:max-w-xs text-base py-4 h-14 border-3 border-blue-500/40 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 bg-card rounded-xl shadow-md"
                    />
                    <Button 
                      onClick={checkPostcode} 
                      disabled={!postcode || isLoading}
                      variant="blue"
                      className="w-full sm:w-auto px-4 sm:px-6 py-4 sm:py-3 text-sm sm:text-base font-medium min-h-[56px] sm:min-h-[48px] shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isLoading ? "Checking..." : (
                        <>
                          <span className="hidden sm:inline">📍 Check Live Disasters</span>
                          <span className="sm:hidden">📍 Check</span>
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {/* Disaster Result Card */}
                  {postcode && (
                    <Card className="mt-4 border-blue-500/30">
                      <CardContent className="pt-4">
                        {renderDisasterResults()}
                      </CardContent>
                    </Card>
                  )}
                </div>

                <Separator className="my-6" />
                
                {/* Other Exemption Paths */}
                <Collapsible open={isOtherExemptionsExpanded} onOpenChange={setIsOtherExemptionsExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-card border-border hover:bg-muted hover:border-blue-500/40 min-h-[48px] text-sm sm:text-base">
                      Other exemption paths (if no disaster applies)
                      {isOtherExemptionsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    <div className="grid gap-2 text-sm">
                      <div className="p-3 border border-blue-500/20 rounded-lg">
                        <strong>🍼 Child under 12 months</strong> - Provider verifies age
                      </div>
                      <div className="p-3 border border-blue-500/20 rounded-lg">
                        <strong>🏠 Homelessness</strong> - Provider assesses accommodation
                      </div>
                      <div className="p-3 border border-blue-500/20 rounded-lg">
                        <strong>🔴 Aboriginal Health Services</strong> - Provider confirms eligibility
                      </div>
                      <div className="p-3 border border-blue-500/20 rounded-lg">
                        <strong>🦠 COVID-19 requirements</strong> - Provider verifies health orders
                      </div>
                      <div className="p-3 border border-blue-500/20 rounded-lg">
                        <strong>💊 Sexual/reproductive health</strong> - Provider determines sensitive matter eligibility
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>


                <Collapsible open={isDetailsExpanded} onOpenChange={setIsDetailsExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-card border-border hover:bg-muted hover:border-blue-500/40 min-h-[48px] text-sm sm:text-base">
                      Show full guidance (detailed exemptions & what to discuss)
                      {isDetailsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    <DisasterExemptionNote />
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>12-month rule:</strong> GPs require in-person visit within 12 months for Medicare telehealth. NPs will from 1 Nov 2025. However, exemptions exist - your provider assesses eligibility.
                      </AlertDescription>
                    </Alert>

                    <Alert className="border-2 border-blue-500/50 bg-blue-50 dark:border-blue-500/40 dark:bg-blue-950">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-700 dark:text-blue-300">
                        <strong>Private fees:</strong> If you don't meet Medicare criteria, practice may charge private fee. Discuss costs when booking.
                      </AlertDescription>
                    </Alert>
                  </CollapsibleContent>
                </Collapsible>



              </div>

              {renderResults()}
              
              {showResults && (
                <>
                  <div className="mt-8 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      <strong>Footer:</strong> This information is based on publicly available Medicare guidelines. 
                      Interpretation and application are at the discretion of qualified healthcare providers. 
                      When in doubt, contact your provider's office directly to discuss your specific circumstances.
                      <br /><br />
                      <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                      <br />
                      <strong>Source:</strong> Department of Health Medicare Guidelines
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PatientEligibilityChecker;