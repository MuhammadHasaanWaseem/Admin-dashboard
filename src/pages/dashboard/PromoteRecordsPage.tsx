import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const PromoteRecordsPage = () => {
  const { promotions } = useData();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Promotion Records</h1>
        <p className="text-muted-foreground text-sm mt-1">Track all promotions</p>
      </div>

      {promotions.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No promotions yet</p>
      )}

      <div className="grid gap-3">
        {promotions.map(p => (
          <Card
            key={p.id}
            className="glass-card cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => navigate(`/dashboard/promote-records/${p.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.organizer} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Megaphone className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{p.organizer}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                      {p.url && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Link</span>}
                    </div>
                  </div>
                </div>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize shrink-0",
                  p.status === "active" ? "status-active" : "status-blocked"
                )}>
                  {p.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PromoteRecordsPage;
