import { useData } from "@/contexts/DataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, Mail, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ApprovedPage = () => {
  const { organizations } = useData();
  const navigate = useNavigate();
  const approved = organizations.filter((o) => o.is_verified);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Approved Organizations</h1>
        <p className="text-muted-foreground text-sm mt-1">Verified organizations</p>
      </div>

      <div className="grid gap-3">
        {approved.map((org) => (
          <Card
            key={org.id}
            className="glass-card cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => navigate(`/dashboard/organizations/${org.id}`)}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-semibold text-foreground">{org.name}</h4>
                    {org.ein && <Badge variant="outline" className="text-xs">{org.ein}</Badge>}
                  </div>
                  {org.mission && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{org.mission}</p>}
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                    {org.website_url && (
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {org.website_url.replace(/^https?:\/\//, "")}</span>
                    )}
                    {org.contact_email && (
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {org.contact_email}</span>
                    )}
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(org.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {approved.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No verified organizations yet</p>
        )}
      </div>
    </div>
  );
};

export default ApprovedPage;
