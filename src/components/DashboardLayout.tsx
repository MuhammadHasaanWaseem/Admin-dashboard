import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, Bell, Megaphone, Building2, Users, LogOut, Menu, X, CheckCircle, ClipboardList, FileText, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard/updates", label: "New Updates", icon: Bell },
  { to: "/dashboard/promote", label: "Promote", icon: Megaphone },
  { to: "/dashboard/organizations", label: "Organizations", icon: Building2 },
  { to: "/dashboard/users", label: "Users", icon: Users },
  { to: "/dashboard/approved", label: "Approved", icon: CheckCircle },
  { to: "/dashboard/update-records", label: "Update Records", icon: ClipboardList },
  { to: "/dashboard/promote-records", label: "Promo Records", icon: FileText },
  { to: "/dashboard/guide", label: "How to Use", icon: HelpCircle },
];

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 sidebar-gradient flex flex-col transition-transform duration-300 lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-sidebar-primary" />
          </div>
          <span className="font-bold text-sidebar-accent-foreground text-lg">Admin</span>
          <button className="lg:hidden ml-auto text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-destructive transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-h-screen">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 lg:px-8 h-14 flex items-center">
          <button className="lg:hidden mr-3" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="text-sm font-medium text-muted-foreground">Dashboard</h2>
        </header>
        <div className="p-4 lg:p-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
