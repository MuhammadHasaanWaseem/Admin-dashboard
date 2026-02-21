import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { Building2, Check, X, Search, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import styles from "./OrganizationsPage.module.css";

const PAGE_SIZE = 10;

const OrganizationsPage = () => {
  const { organizations, loadingOrgs, setOrgVerified } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = organizations.filter(
    (org) =>
      org.name?.toLowerCase().includes(search.toLowerCase()) ||
      org.contact_email?.toLowerCase().includes(search.toLowerCase()) ||
      org.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
      org.ein?.toLowerCase().includes(search.toLowerCase())
  );

  const verifiedCount = organizations.filter((o) => o.is_verified).length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleVerify = async (id: string, verified: boolean) => {
    await setOrgVerified(id, verified);
    toast.success(verified ? "Organization verified" : "Organization unverified");
  };

  const metaParts = (org: (typeof organizations)[0]) => {
    const parts: string[] = [];
    if (org.contact_name) parts.push(org.contact_name);
    if (org.contact_email) parts.push(org.contact_email);
    if (org.ein) parts.push(`EIN ${org.ein}`);
    return parts.length ? parts.join(" · ") : "No contact info";
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div className={styles.header}>
          <h1 className={styles.title}>Organizations</h1>
          <p className={styles.subtitle}>Manage and verify organizations</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{filtered.length}</div>
            <div className={styles.statLabel}>Total</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statValue}>{verifiedCount}</div>
            <div className={styles.statLabel}>Verified</div>
          </div>
        </div>
      </div>

      <div className={styles.searchWrap}>
        <Search className={styles.searchIcon} />
        <input
          type="search"
          placeholder="Search by name, contact, email or EIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
          aria-label="Search organizations"
        />
      </div>

      <Card className="glass-card overflow-hidden border-0 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          {loadingOrgs ? (
            <p className={styles.loading}>Loading organizations...</p>
          ) : (
            <>
            <div className={styles.cardList}>
              {paginated.map((org) => (
                <article
                  key={org.id}
                  className={styles.orgCard}
                  onClick={() => navigate(`/dashboard/organizations/${org.id}`)}
                >
                  <div className={styles.orgIcon}>
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className={styles.orgMain}>
                    <h3 className={styles.orgName}>{org.name || "Unnamed organization"}</h3>
                    <p className={styles.orgMeta}>{metaParts(org)}</p>
                  </div>
                  <div className={styles.orgRight} onClick={(e) => e.stopPropagation()}>
                    <span className={org.is_verified ? styles.statusVerified : styles.statusUnverified}>
                      {org.is_verified ? "Verified" : "Unverified"}
                    </span>
                    <div className={styles.actions}>
                      {!org.is_verified && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button type="button" className={`${styles.actionBtn} ${styles.actionBtnVerify}`} aria-label="Verify">
                              <Check className="w-4 h-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Verify {org.name}?</AlertDialogTitle>
                              <AlertDialogDescription>This will mark the organization as verified in the database.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleVerify(org.id, true)}>Verify</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      {org.is_verified && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button type="button" className={`${styles.actionBtn} ${styles.actionBtnUnverify}`} aria-label="Unverify">
                              <X className="w-4 h-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Unverify {org.name}?</AlertDialogTitle>
                              <AlertDialogDescription>This will mark the organization as unverified.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleVerify(org.id, false)}>Unverify</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className={styles.viewLink}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/organizations/${org.id}`);
                        }}
                      >
                        View <ChevronRight className="w-4 h-4 ml-0.5" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {filtered.length > PAGE_SIZE && (
              <div className={styles.paginationWrap}>
                <p className={styles.paginationSummary}>
                  {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) setPage((p) => p - 1);
                        }}
                        className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                        aria-disabled={page <= 1}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .map((p, i, arr) => (
                        <Fragment key={p}>
                          {i > 0 && arr[i - 1] !== p - 1 && (
                            <PaginationItem>
                              <span className="flex h-9 w-9 items-center justify-center text-muted-foreground">…</span>
                            </PaginationItem>
                          )}
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(p);
                              }}
                              isActive={page === p}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        </Fragment>
                      ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < totalPages) setPage((p) => p + 1);
                        }}
                        className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                        aria-disabled={page >= totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
            </>
          )}
          {!loadingOrgs && filtered.length === 0 && (
            <p className={styles.empty}>No organizations found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationsPage;
