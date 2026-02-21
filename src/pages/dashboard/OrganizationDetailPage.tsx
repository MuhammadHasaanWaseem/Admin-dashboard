import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Building2, Check, X, ArrowLeft, Globe, Mail, Phone, MapPin, User, Calendar, Hash, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import styles from "./OrganizationDetailPage.module.css";

const Field = ({ label, value, mono }: { label: string; value: string | null | undefined; mono?: boolean }) => (
  <div className={styles.row}>
    <span className={styles.rowLabel}>{label}</span>
    <span className={mono ? styles.idValue : styles.rowValue}>{value ?? "—"}</span>
  </div>
);

const OrganizationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { organizations, setOrgVerified } = useData();
  const org = organizations.find((o) => o.id === id);

  if (!org) {
    return (
      <div className="text-center py-20 px-4">
        <p className="text-muted-foreground">Organization not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard/organizations")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to list
        </Button>
      </div>
    );
  }

  const handleVerify = async (verified: boolean) => {
    await setOrgVerified(org.id, verified);
    toast.success(verified ? "Organization verified" : "Organization unverified");
  };

  const hasCoords = org.latitude != null && org.longitude != null;
  const mapsUrl = hasCoords ? `https://www.google.com/maps?q=${org.latitude},${org.longitude}` : null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={styles.page}>
      <button type="button" className={styles.back} onClick={() => navigate("/dashboard/organizations")}>
        <ArrowLeft className="w-4 h-4" /> Back to Organizations
      </button>

      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <div className={styles.heroIcon}>
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          <div className={styles.heroTitleWrap}>
            <h1 className={styles.heroTitle}>{org.name || "Unnamed"}</h1>
            <div className={styles.heroBadges}>
              {org.ein && <span className={styles.rowValue}>EIN: {org.ein}</span>}
              <span className={org.is_verified ? styles.statusVerified : styles.statusUnverified}>
                {org.is_verified ? "Verified" : "Unverified"}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.heroActions}>
          {!org.is_verified && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm"><Check className="w-4 h-4 mr-2" /> Verify</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Verify this organization?</AlertDialogTitle>
                  <AlertDialogDescription>This will mark the organization as verified in the database.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleVerify(true)}>Verify</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {org.is_verified && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive"><X className="w-4 h-4 mr-2" /> Unverify</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unverify this organization?</AlertDialogTitle>
                  <AlertDialogDescription>This will mark the organization as unverified.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleVerify(false)}>Unverify</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        <Card className="glass-card">
          <CardContent className={styles.card}>
            <h2 className={styles.sectionTitle}>Identity</h2>
            <Field label="ID" value={org.id} mono />
            <Field label="Owner ID" value={org.owner_id} mono />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className={styles.card}>
            <h2 className={styles.sectionTitle}>Basic info</h2>
            <Field label="Name" value={org.name} />
            <Field label="EIN" value={org.ein} />
          </CardContent>
        </Card>

        {org.mission != null && org.mission !== "" && (
          <Card className={`glass-card ${styles.missionCard}`}>
            <CardContent className={styles.card}>
              <h2 className={styles.sectionTitle}>Mission</h2>
              <p className={styles.missionText}>{org.mission}</p>
            </CardContent>
          </Card>
        )}

        <Card className="glass-card">
          <CardContent className={styles.card}>
            <h2 className={styles.sectionTitle}>Contact</h2>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Contact name</span>
              <span className={styles.rowValue}>{org.contact_name ?? "—"}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Email</span>
              <span className={styles.rowValue}>
                {org.contact_email ? <a href={`mailto:${org.contact_email}`}>{org.contact_email}</a> : "—"}
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Phone</span>
              <span className={styles.rowValue}>
                {org.contact_phone ? <a href={`tel:${org.contact_phone}`}>{org.contact_phone}</a> : "—"}
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Website</span>
              <span className={styles.rowValue}>
                {org.website_url ? (
                  <a href={org.website_url} target="_blank" rel="noopener noreferrer">
                    {org.website_url} <ExternalLink className="inline w-3 h-3 ml-0.5" />
                  </a>
                ) : "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className={styles.card}>
            <h2 className={styles.sectionTitle}>Location</h2>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Address</span>
              <span className={styles.rowValue}>{org.address ?? "—"}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Coordinates</span>
              <span className={styles.rowValue}>
                {hasCoords ? (
                  <a href={mapsUrl!} target="_blank" rel="noopener noreferrer" className={styles.mapLink}>
                    {org.latitude}, {org.longitude} (open in maps)
                  </a>
                ) : "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className={styles.card}>
            <h2 className={styles.sectionTitle}>Meta</h2>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Verified</span>
              <span className={styles.rowValue}>{org.is_verified ? "Yes" : "No"}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Created</span>
              <span className={styles.rowValue}>{org.created_at ? new Date(org.created_at).toLocaleString() : "—"}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Updated</span>
              <span className={styles.rowValue}>{org.updated_at ? new Date(org.updated_at).toLocaleString() : "—"}</span>
            </div>
            {org.tags != null && org.tags.length > 0 && (
              <div className={styles.row}>
                <span className={styles.rowLabel}>Tags</span>
                <div className={styles.tagsWrap}>
                  {org.tags.map((t) => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default OrganizationDetailPage;
