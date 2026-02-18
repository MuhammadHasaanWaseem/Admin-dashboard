import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Building2, Check, X, Mail, Phone, MapPin, Globe, User, Users, Calendar, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const statusStyles = {
  pending: "status-pending",
  approved: "status-approved",
  rejected: "status-rejected",
};

const OrganizationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { organizations, updateOrgStatus } = useData();
  const org = organizations.find(o => o.id === id);

  if (!org) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Organization not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard/organizations")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const handleApprove = () => {
    updateOrgStatus(org.id, "approved");
    toast.success("Organization approved");
  };

  const handleReject = () => {
    updateOrgStatus(org.id, "rejected");
    toast.error("Organization rejected");
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <button
        onClick={() => navigate("/dashboard/organizations")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Organizations
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{org.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{org.type}</Badge>
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium capitalize", statusStyles[org.status])}>
                {org.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {org.status !== "approved" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button><Check className="w-4 h-4 mr-2" /> Approve</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Approve {org.name}?</AlertDialogTitle>
                  <AlertDialogDescription>This will approve the organization and grant them platform access.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleApprove}>Approve</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {org.status !== "rejected" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive"><X className="w-4 h-4 mr-2" /> Reject</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reject {org.name}?</AlertDialogTitle>
                  <AlertDialogDescription>This will reject the organization and revoke their access.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReject}>Reject</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <Card className="glass-card">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">About</h3>
          <p className="text-foreground">{org.description}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="glass-card">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Contact Information</h3>
            <Separator />
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-primary shrink-0" />
                <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                  {org.website}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{org.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{org.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{org.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Organization Details</h3>
            <Separator />
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">Contact: {org.contactPerson}</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">{org.memberCount} members</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-foreground">Registered: {org.registeredAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default OrganizationDetailPage;
