import React, { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  // Let Outseta handle authentication flow naturally - no automatic redirects

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      <Header />

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Members Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Access your TeleCheck dashboard to verify Medicare telehealth eligibility.
              </p>

              {/* Outseta Login Button using no-code approach */}
              <Button
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700"
                data-o-auth="1"
                data-mode="popup"
                data-widget-mode="login"
              >
                Login to TeleCheck
              </Button>

              <div className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-red-400"
                  data-o-auth="1"
                  data-mode="popup"
                  data-widget-mode="register"
                  data-plan-uid="pWrbAMWn"
                  data-skip-plan-options="true"
                >
                  Sign up here
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;