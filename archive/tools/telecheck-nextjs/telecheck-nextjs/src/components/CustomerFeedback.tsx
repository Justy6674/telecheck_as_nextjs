import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const CustomerFeedback = () => {
  const [feedbackType, setFeedbackType] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackType || !message.trim()) {
      toast({
        title: "Please fill all fields",
        description: "Both feedback type and message are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('customer-feedback', {
        body: {
          feedback_type: feedbackType,
          message: message.trim(),
          user_id: user?.id,
          user_email: user?.email
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Feedback submitted successfully!",
        description: "Thank you for helping us improve TeleCheck. We'll review your feedback and get back to you if needed.",
      });

      // Reset form
      setFeedbackType('');
      setMessage('');
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error submitting feedback",
        description: error.message || "Please try again or contact support@telecheck.com.au",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Send Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feedback-type" className="text-white">
              What type of feedback would you like to share?
            </Label>
            <Select value={feedbackType} onValueChange={setFeedbackType}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suggestion">Suggestion for improvement</SelectItem>
                <SelectItem value="feature-request">Feature request</SelectItem>
                <SelectItem value="bug-report">Bug report</SelectItem>
                <SelectItem value="general">General feedback</SelectItem>
                <SelectItem value="praise">Positive feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">
              Your feedback
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you think could be improved or what you'd like to see..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
              maxLength={1000}
            />
            <div className="text-white/70 text-xs text-right">
              {message.length}/1000 characters
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !feedbackType || !message.trim()}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Feedback
              </>
            )}
          </Button>
        </form>

        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <p className="text-white/70 text-sm">
            Need immediate help? Email us directly at{' '}
            <a
              href="mailto:support@telecheck.com.au"
              className="text-primary hover:underline"
            >
              support@telecheck.com.au
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};