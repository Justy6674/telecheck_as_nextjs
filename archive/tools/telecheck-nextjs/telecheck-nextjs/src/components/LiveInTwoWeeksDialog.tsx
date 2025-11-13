import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, Calendar } from "lucide-react";

interface LiveInTwoWeeksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
}

export const LiveInTwoWeeksDialog = ({ open, onOpenChange, onContinue }: LiveInTwoWeeksDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-red-500" />
            Subscription Launch Update
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Rocket className="h-8 w-8 text-red-500" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Going Live in 2 Weeks!</h3>
          <p className="text-muted-foreground mb-6">
            TeleCheck Professional Subscription will be fully live and accepting new sign-ups in approximately 2 weeks. 
            Thank you for your patience!
          </p>
          
          <Button onClick={() => {
            onOpenChange(false);
            onContinue();
          }}>
            Got It, Continue to Login/Subscribe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
