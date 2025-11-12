import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Mail, 
  MessageSquare, 
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Brain,
  Sparkles,
  Clock
} from 'lucide-react';

interface EmailSummary {
  total: number;
  unread: number;
  recent: number;
  categories: {
    support: number;
    feedback: number;
    complaints: number;
    technical: number;
  };
}

interface EmailAnalysis {
  summary: string;
  commonIssues: string[];
  recommendations: string[];
  urgentIssues: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

export const AdminEmailAnalysis = () => {
  const [emailSummary, setEmailSummary] = useState<EmailSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<EmailAnalysis | null>(null);
  const { toast } = useToast();

  const loadEmailSummary = useCallback(async () => {
    setLoading(true);
    try {
      // Get email statistics
      const { count: totalEmails } = await supabase
        .from('email_logs')
        .select('*', { count: 'exact', head: true });

      const { count: recentEmails } = await supabase
        .from('email_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Mock categories for now - in production this would analyze actual email content
      setEmailSummary({
        total: totalEmails || 0,
        unread: Math.floor((totalEmails || 0) * 0.15), // 15% unread rate
        recent: recentEmails || 0,
        categories: {
          support: Math.floor((recentEmails || 0) * 0.4),
          feedback: Math.floor((recentEmails || 0) * 0.25),
          complaints: Math.floor((recentEmails || 0) * 0.2),
          technical: Math.floor((recentEmails || 0) * 0.15)
        }
      });
    } catch (error) {
      console.error('Error loading email summary:', error);
      toast({
        title: "Error",
        description: "Failed to load email statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadEmailSummary();
  }, [loadEmailSummary]);


  const analyzeEmailsWithAI = useCallback(async () => {
    if (aiAnalyzing || !emailSummary) return;
    
    // Only analyze if there are enough emails to warrant AI analysis
    if (emailSummary.recent < 5 && emailSummary.unread < 3) {
      toast({
        title: "Insufficient Data",
        description: "AI analysis requires at least 5 recent emails or 3 unread emails",
      });
      return;
    }

    setAiAnalyzing(true);
    setAnalysis(null);

    try {
      const analysisPrompt = `
Analyze TeleCheck's customer email patterns and provide actionable insights:

**Email Statistics:**
- Total emails: ${emailSummary.total}
- Unread emails: ${emailSummary.unread}
- Recent (7 days): ${emailSummary.recent}
- Support requests: ${emailSummary.categories.support}
- Feedback: ${emailSummary.categories.feedback}  
- Complaints: ${emailSummary.categories.complaints}
- Technical issues: ${emailSummary.categories.technical}

**Context:**
TeleCheck helps healthcare clinics check Medicare disaster eligibility for patients. Common issues include:
- Postcode lookup problems
- Subscription/billing questions
- Bulk analysis tool confusion
- Data accuracy concerns
- DisasterAssist.gov.au integration issues

Please provide:
1. **Overall Assessment** - What these patterns suggest about user experience
2. **Common Issues** - Top 3-5 likely problems users are facing
3. **Priority Actions** - Specific improvements to reduce support volume
4. **Urgent Issues** - Any patterns suggesting critical problems
5. **System Improvements** - Features that could prevent these emails

Focus on actionable recommendations for the development team.
      `;

      const { data: functionData, error: functionError } = await supabase.functions.invoke('ai', {
        body: { message: analysisPrompt }
      });

      if (functionError) {
        throw new Error(functionError.message || "Failed to get AI analysis");
      }

      const aiResponse = functionData?.response;
      if (aiResponse) {
        // Parse the AI response into structured data
        setAnalysis({
          summary: aiResponse,
          commonIssues: [], // Would parse from AI response
          recommendations: [], // Would parse from AI response  
          urgentIssues: [], // Would parse from AI response
          sentiment: emailSummary.categories.complaints > emailSummary.categories.feedback ? 'negative' : 'neutral'
        });
        
        toast({
          title: "Email Analysis Complete",
          description: "AI insights generated for recent email patterns",
        });
      } else {
        throw new Error("No response from AI");
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze emails with AI",
        variant: "destructive"
      });
    } finally {
      setAiAnalyzing(false);
    }
  }, [emailSummary, aiAnalyzing, toast]);

  const getCategoryColor = (category: string, count: number) => {
    if (category === 'complaints' && count > 5) return 'destructive';
    if (category === 'technical' && count > 3) return 'destructive';
    if (category === 'support' && count > 10) return 'outline';
    return 'secondary';
  };

  const shouldShowAIButton = emailSummary && (emailSummary.recent >= 5 || emailSummary.unread >= 3);

  return (
    <div className="space-y-6">
      {/* Email Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailSummary?.total || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{emailSummary?.unread || 0}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent (7d)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emailSummary?.recent || 0}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complaints</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {emailSummary?.categories.complaints || 0}
            </div>
            <p className="text-xs text-muted-foreground">Need immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Email Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Categories (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button 
              onClick={loadEmailSummary} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            {shouldShowAIButton && (
              <Button 
                onClick={analyzeEmailsWithAI}
                disabled={aiAnalyzing}
                variant="secondary"
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
              >
                {aiAnalyzing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                AI Analysis
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {emailSummary && Object.entries(emailSummary.categories).map(([category, count]) => (
              <div key={category} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold mb-2">{count}</div>
                <Badge variant={getCategoryColor(category, count)} className="capitalize">
                  {category}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              AI Email Pattern Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm">
                {analysis.summary}
              </div>
            </div>
            <Button 
              onClick={() => setAnalysis(null)}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {emailSummary && emailSummary.unread > 5 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You have {emailSummary.unread} unread emails. Consider using AI analysis to identify urgent issues.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};