import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Megaphone, ArrowLeft, StopCircle, Calendar, Globe, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const PromoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { promotions, endPromotion } = useData();
  const promo = promotions.find(p => p.id === id);

  if (!promo) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Promotion not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard/promote-records")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <button onClick={() => navigate("/dashboard/promote-records")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Promotion Records
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Megaphone className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{promo.organizer}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium capitalize", promo.status === "active" ? "status-active" : "status-blocked")}>
                {promo.status}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="w-3 h-3" /> {new Date(promo.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {promo.status === "active" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive"><StopCircle className="w-4 h-4 mr-2" /> End Promotion</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>End this promotion?</AlertDialogTitle>
                <AlertDialogDescription>This will mark the promotion as ended. It will no longer be active.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={async () => { await endPromotion(promo.id); toast.success("Promotion ended"); }}>End Promotion</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {promo.imageUrl && (
        <Card className="glass-card overflow-hidden">
          <img src={promo.imageUrl} alt={promo.organizer} className="w-full max-h-72 object-cover" />
        </Card>
      )}

      <Card className="glass-card">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Event Details</h3>
          <p className="text-foreground">{promo.eventDetails}</p>
        </CardContent>
      </Card>

      {promo.url && (
        <Card className="glass-card">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">URL</h3>
            <a href={promo.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
              <Globe className="w-4 h-4" /> {promo.url} <ExternalLink className="w-3 h-3" />
            </a>
          </CardContent>
        </Card>
      )}

      {promo.additionalInfo && (
        <Card className="glass-card">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Additional Information</h3>
            <p className="text-foreground">{promo.additionalInfo}</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default PromoteDetailPage;
