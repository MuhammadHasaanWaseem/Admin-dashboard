import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Users, ShieldOff, ShieldCheck, Trash2, Mail, Phone, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const UsersPage = () => {
  const { users, toggleUserBlock, removeUser } = useData();
  const [search, setSearch] = useState("");

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage registered users</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-3">
        {filtered.map(user => (
          <Card key={user.id} className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{user.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                      <span className="hidden sm:flex items-center gap-1"><Phone className="w-3 h-3" /> {user.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-medium capitalize",
                    user.status === "active" ? "status-active" : "status-blocked"
                  )}>
                    {user.status}
                  </span>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" title={user.status === "active" ? "Block user" : "Unblock user"}>
                        {user.status === "active" ? <ShieldOff className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{user.status === "active" ? "Block" : "Unblock"} {user.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {user.status === "active"
                            ? "This user will be blocked and won't be able to access the platform."
                            : "This user will be unblocked and regain access to the platform."}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                          toggleUserBlock(user.id);
                          toast.success(user.status === "active" ? "User blocked" : "User unblocked");
                        }}>
                          {user.status === "active" ? "Block" : "Unblock"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove {user.name}?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. The user will be permanently removed.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { removeUser(user.id); toast.success("User removed"); }}>
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No users found</p>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
