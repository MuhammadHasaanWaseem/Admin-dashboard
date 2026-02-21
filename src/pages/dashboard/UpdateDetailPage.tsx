import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Bell, ArrowLeft, StopCircle, Calendar } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const UpdateDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updates, endUpdate } = useData();
  const update = updates.find(u => u.id === id);

  if (!update) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Update not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard/update-records")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <button onClick={() => navigate("/dashboard/update-records")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Update Records
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bell className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{update.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium capitalize", update.status === "active" ? "status-active" : "status-blocked")}>
                {update.status}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="w-3 h-3" /> {new Date(update.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {update.status === "active" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive"><StopCircle className="w-4 h-4 mr-2" /> End Update</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>End this update?</AlertDialogTitle>
                <AlertDialogDescription>This will mark the update as ended. You'll then be able to create a new update.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={async () => { await endUpdate(update.id); toast.success("Update ended"); }}>End Update</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Card className="glass-card">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Subtitle</h3>
          <p className="text-foreground">{update.subtitle}</p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Features</h3>
          <Separator className="mb-3" />
          <ul className="space-y-2">
            {update.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> {f}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UpdateDetailPage;
