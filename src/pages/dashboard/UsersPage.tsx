import { useState, useEffect, Fragment } from "react";
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
import { Users, ShieldOff, ShieldCheck, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import styles from "./UsersPage.module.css";

const PAGE_SIZE = 10;

const UsersPage = () => {
  const { users, loadingUsers, toggleUserBlock, removeUser } = useData();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = users.filter(
    (u) =>
      (u.full_name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (u.username?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  useEffect(() => setPage(1), [search]);

  const displayName = (u: (typeof users)[0]) =>
    u.full_name?.trim() || u.username?.trim() || u.email || "Unknown";

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div className={styles.header}>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.subtitle}>Manage registered users from profiles</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statValue}>{filtered.length}</div>
            <div className={styles.statLabel}>Total</div>
          </div>
        </div>
      </div>

      <div className={styles.searchWrap}>
        <Search className={styles.searchIcon} />
        <input
          type="search"
          placeholder="Search by name, username or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
          aria-label="Search users"
        />
      </div>

      <Card className="glass-card overflow-hidden border-0 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          {loadingUsers ? (
            <p className={styles.loading}>Loading users...</p>
          ) : (
            <>
              <div className={styles.cardList}>
                {paginated.map((user) => (
                  <article key={user.id} className={styles.userCard}>
                    {user.profile_picture ? (
                      <img src={user.profile_picture} alt="" className={styles.avatar} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        <Users className="w-5 h-5" />
                      </div>
                    )}
                    <div className={styles.userMain}>
                      <h3 className={styles.userName}>{displayName(user)}</h3>
                      <p className={styles.userMeta}>
                        {user.email}
                        {user.location ? ` · ${user.location}` : ""}
                      </p>
                    </div>
                    <div className={styles.userRight}>
                      <span className={user.block ? styles.statusBlocked : styles.statusActive}>
                        {user.block ? "Blocked" : "Active"}
                      </span>
                      <div className={styles.actions}>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${user.block ? styles.actionBtnUnblock : styles.actionBtnBlock}`}
                              title={user.block ? "Unblock" : "Block"}
                              aria-label={user.block ? "Unblock" : "Block"}
                            >
                              {user.block ? <ShieldCheck className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {user.block ? "Unblock" : "Block"} {displayName(user)}?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {user.block
                                  ? "This user will regain access to the platform."
                                  : "This user will be blocked and won't be able to access the platform."}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  await toggleUserBlock(user.id);
                                  toast.success(user.block ? "User unblocked" : "User blocked");
                                }}
                              >
                                {user.block ? "Unblock" : "Block"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.actionBtnRemove}`}
                              aria-label="Remove user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove {displayName(user)}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will delete the user profile. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  await removeUser(user.id);
                                  toast.success("User removed");
                                }}
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
          {!loadingUsers && filtered.length === 0 && (
            <p className={styles.empty}>No users found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
