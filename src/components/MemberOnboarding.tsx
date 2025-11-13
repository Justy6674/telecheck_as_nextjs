import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  MapPin,
  FileText,
  BarChart3,
  Download,
  Users,
  Shield,
  Clock,
  Smartphone,
  Zap,
  Target
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

interface MemberOnboardingProps {
  onComplete: () => void;
  userEmail?: string;
}

const MemberOnboarding: React.FC<MemberOnboardingProps> = ({ onComplete, userEmail }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);

  const steps = [
    {
      title: "Welcome to TeleCheck Professional",
      icon: <Shield className="h-12 w-12 text-emerald-500" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Logo className="h-16 w-16" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to TeleCheck Professional!</h2>
            <p className="text-lg text-slate-300 mb-6">
              You've successfully upgraded to our premium telehealth eligibility platform.
              Let's show you what you can do with your new professional tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <Clock className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Save Time</h3>
              <p className="text-sm text-slate-400">Bulk check hundreds of postcodes instantly</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <BarChart3 className="h-8 w-8 text-cyan-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Analyse Clinics</h3>
              <p className="text-sm text-slate-400">Advanced patient eligibility analytics</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <Download className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white">Export Results</h3>
              <p className="text-sm text-slate-400">Professional reports for your practice</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">Professional Healthcare Access</h4>
                <p className="text-sm text-slate-300">
                  You now have unlimited access to all TeleCheck features, designed specifically for Australian healthcare professionals managing disaster telehealth eligibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Individual Postcode Checker",
      icon: <MapPin className="h-12 w-12 text-blue-500" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Quick Individual Checks</h2>
            <p className="text-lg text-slate-300 mb-6">
              Perfect for checking individual patients during consultations
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">How it works:</h3>
                <p className="text-slate-400">Enter any Australian postcode to instantly check eligibility</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">1</div>
                <span className="text-slate-300">Type or paste a postcode (e.g., 2000, 3000)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">2</div>
                <span className="text-slate-300">Get instant telehealth eligibility results for disaster zones</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">3</div>
                <span className="text-slate-300">View active disasters affecting that area</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">4</div>
                <span className="text-slate-300">Save results for future reference</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-emerald-400 mb-1">Perfect for Consultations</h4>
                <p className="text-sm text-slate-300">
                  Use this during patient calls to instantly verify telehealth eligibility based on their location.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Bulk Postcode Analyser",
      icon: <FileText className="h-12 w-12 text-cyan-500" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Bulk Analysis Tool</h2>
            <p className="text-lg text-slate-300 mb-6">
              Upload CSV files to check hundreds of postcodes at once
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-cyan-500/20 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Powerful Bulk Processing:</h3>
                <p className="text-slate-400">Process entire patient databases efficiently</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-white">Supported Formats:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300">CSV files with postcode column</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300">Excel exports (.xlsx)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300">Practice management system exports</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-white">What You Get:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-400" />
                    <span className="text-slate-300">Eligibility status for each postcode</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-400" />
                    <span className="text-slate-300">Active disaster information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-400" />
                    <span className="text-slate-300">Downloadable results</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-400 mb-1">Professional Efficiency</h4>
                <p className="text-sm text-slate-300">
                  Process your entire patient database in minutes, not hours. Perfect for practice-wide eligibility audits.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Advanced Clinic Analysis",
      icon: <BarChart3 className="h-12 w-12 text-purple-500" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Clinic Analysis Dashboard</h2>
            <p className="text-lg text-slate-300 mb-6">
              Professional analytics for your practice management
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Advanced Analytics:</h3>
                <p className="text-slate-400">Comprehensive insights for your clinic operations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-white">Patient Analytics:</h4>
                <div className="space-y-3">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm font-medium text-white">Eligibility Distribution</span>
                    </div>
                    <p className="text-xs text-slate-400">See what percentage of patients qualify for telehealth</p>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-white">Geographic Spread</span>
                    </div>
                    <p className="text-xs text-slate-400">Understand your patient catchment areas</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-white">Business Intelligence:</h4>
                <div className="space-y-3">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <BarChart3 className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm font-medium text-white">Revenue Impact</span>
                    </div>
                    <p className="text-xs text-slate-400">Calculate potential telehealth revenue opportunities</p>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium text-white">Time Savings</span>
                    </div>
                    <p className="text-xs text-slate-400">Track efficiency gains from telehealth adoption</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <BarChart3 className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-purple-400 mb-1">Strategic Insights</h4>
                <p className="text-sm text-slate-300">
                  Make data-driven decisions about your telehealth services and patient outreach strategies.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Export & Reporting Features",
      icon: <Download className="h-12 w-12 text-emerald-500" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Professional Reporting</h2>
            <p className="text-lg text-slate-300 mb-6">
              Generate comprehensive reports for your practice and compliance needs
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-emerald-500/20 p-3 rounded-lg">
                <Download className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Export Capabilities:</h3>
                <p className="text-slate-400">Professional-grade reports for your practice</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-white">Available Formats:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300">CSV for further analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300">Excel workbooks (.xlsx)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300">PDF summary reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <span className="text-slate-300">Practice management system integration</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-white">Report Contents:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span className="text-slate-300">Detailed eligibility breakdowns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span className="text-slate-300">Active disaster information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span className="text-slate-300">Patient summary statistics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-400" />
                    <span className="text-slate-300">Compliance documentation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-emerald-400 mb-1">Compliance Ready</h4>
                <p className="text-sm text-slate-300">
                  All reports include timestamp, source data, and Medicare eligibility criteria for audit trails and compliance documentation.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-400 mb-1">📧 Welcome Email Sent</h4>
                <p className="text-sm text-slate-300">
                  We've sent a welcome email to your inbox.
                  <strong> Please check your spam or junk folder</strong> if you don't see it within a few minutes.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <h3 className="text-xl font-bold text-white mb-2">You're Ready to Go!</h3>
            <p className="text-slate-300">
              Your TeleCheck Professional account is fully activated. Start using these powerful tools to streamline your telehealth eligibility processes.
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;

      if (!userId) {
        throw new Error('Unable to determine current user id');
      }

      const { error } = await supabase
        .from('profiles')
        .update({ updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating onboarding status:', error);
      }

      // Also store in localStorage as backup
      localStorage.setItem('telecheck_onboarding_completed', 'true');

      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Still call onComplete to not block the user
      onComplete();
    } finally {
      setIsCompleting(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
        <CardHeader className="text-center border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </div>
            <div className="text-sm text-slate-400">
              {userEmail && `Welcome, ${userEmail}`}
            </div>
          </div>

          <Progress value={progress} className="mb-4" />

          <div className="flex justify-center mb-4">
            {steps[currentStep].icon}
          </div>

          <CardTitle className="text-2xl text-white">
            {steps[currentStep].title}
          </CardTitle>
          <CardDescription className="text-slate-400">
            Professional TeleCheck Onboarding Tour
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          {steps[currentStep].content}

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="bg-slate-800 border-slate-600 hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-cyan-400' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>

            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isCompleting}
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
              >
                {isCompleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Start Using TeleCheck
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberOnboarding;