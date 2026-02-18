import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const UpdateRecordsPage = () => {
  const { updates } = useData();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Update Records</h1>
        <p className="text-muted-foreground text-sm mt-1">Track all published updates</p>
      </div>

      {updates.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No updates yet</p>
      )}

      <div className="grid gap-3">
        {updates.map(u => (
          <Card
            key={u.id}
            className="glass-card cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => navigate(`/dashboard/update-records/${u.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{u.title}</h4>
                    <p className="text-xs text-muted-foreground">{u.subtitle} · {u.features.length} features · {new Date(u.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize shrink-0",
                  u.status === "active" ? "status-active" : "status-blocked"
                )}>
                  {u.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UpdateRecordsPage;
