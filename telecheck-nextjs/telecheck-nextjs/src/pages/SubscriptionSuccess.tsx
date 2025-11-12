import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const SubscriptionSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <Header />

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-3xl text-green-600 mb-4">
                Welcome to TeleCheck Professional!
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-lg text-muted-foreground">
                Your subscription has been successfully created.
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Mail className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold">Check Your Email</h3>
                </div>
                <p className="text-muted-foreground">
                  We've sent you an email confirmation link. Click the link in your email to create your password and access your TeleCheck dashboard.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold">What's Next?</h4>
                <ul className="text-left space-y-2 max-w-md mx-auto">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Check your email for confirmation link</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Click the link to create your password</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Access your TeleCheck dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Start verifying Medicare telehealth eligibility</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Button
                  size="lg"
                  onClick={() => window.location.href = 'https://telecheck.outseta.com/auth?widgetMode=login#o-anonymous'}
                  className="mr-4"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Login to Dashboard
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => window.location.href = '/'}
                >
                  Back to Home
                </Button>
              </div>

              <div className="text-sm text-muted-foreground pt-4">
                <p>Need help? Contact us at <a href="mailto:support@telecheck.com.au" className="text-blue-600 hover:underline">support@telecheck.com.au</a></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SubscriptionSuccess;