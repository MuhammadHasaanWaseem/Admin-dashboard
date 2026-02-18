import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Building2, Check, X, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const statusStyles = {
  pending: "status-pending",
  approved: "status-approved",
  rejected: "status-rejected",
};

const OrganizationsPage = () => {
  const { organizations, updateOrgStatus } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filtered = organizations.filter(org =>
    org.name.toLowerCase().includes(search.toLowerCase()) ||
    org.email.toLowerCase().includes(search.toLowerCase()) ||
    org.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Organizations</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage registered organizations</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search organizations by name, email or type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-3">
        {filtered.map(org => (
          <Card
            key={org.id}
            className="glass-card cursor-pointer hover:border-primary/30 transition-colors"
            onClick={() => navigate(`/dashboard/organizations/${org.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{org.name}</h4>
                    <p className="text-xs text-muted-foreground">{org.type} · {org.memberCount} members · {org.registeredAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium capitalize", statusStyles[org.status])}>
                    {org.status}
                  </span>
                  {org.status !== "approved" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-success hover:text-success" onClick={e => e.stopPropagation()}>
                          <Check className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={e => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Approve {org.name}?</AlertDialogTitle>
                          <AlertDialogDescription>This will approve the organization and grant them access to the platform.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => { updateOrgStatus(org.id, "approved"); toast.success("Organization approved"); }}>
                            Approve
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {org.status !== "rejected" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={e => e.stopPropagation()}>
                          <X className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={e => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reject {org.name}?</AlertDialogTitle>
                          <AlertDialogDescription>This will reject the organization and revoke their access.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => { updateOrgStatus(org.id, "rejected"); toast.error("Organization rejected"); }}>
                            Reject
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No organizations found</p>
        )}
      </div>
    </div>
  );
};

export default OrganizationsPage;
