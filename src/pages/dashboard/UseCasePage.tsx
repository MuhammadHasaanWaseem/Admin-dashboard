import { Card, CardContent } from "@/components/ui/card";
import { Bell, Megaphone, Building2, Users, CheckCircle, ClipboardList, FileText, ArrowRight, Shield, ImagePlus, Search, ShieldOff, Trash2, Globe, StopCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Shield,
    title: "Admin Login",
    color: "text-primary",
    bg: "bg-primary/10",
    link: "/",
    instructions: [
      "Go to the login page",
      "Enter email: admin123@gmail.com",
      "Enter password: admin123@",
      "Click 'Sign In' to access the dashboard",
      "Invalid credentials will show an error message",
    ],
  },
  {
    icon: Bell,
    title: "New Updates",
    color: "text-primary",
    bg: "bg-primary/10",
    link: "/dashboard/updates",
    instructions: [
      "Navigate to 'New Updates' tab from sidebar",
      "Fill in Title, Subtitle, and add Features (click '+ Add Feature' for more)",
      "Click 'Publish Update' to submit",
      "⚠️ Only 1 active update allowed at a time",
      "To add a new update, first end the current one from 'Update Records'",
    ],
  },
  {
    icon: ClipboardList,
    title: "Update Records",
    color: "text-primary",
    bg: "bg-primary/10",
    link: "/dashboard/update-records",
    instructions: [
      "Navigate to 'Update Records' tab to see all updates",
      "Click any update to view full details",
      "On the detail page, click 'End Update' to mark it as ended",
      "Once ended, you can create a new update",
      "Active/Ended status is shown with colored badges",
    ],
  },
  {
    icon: Megaphone,
    title: "Promote",
    color: "text-primary",
    bg: "bg-primary/10",
    link: "/dashboard/promote",
    instructions: [
      "Navigate to 'Promote' tab from sidebar",
      "Fill in Organizer name, Event Details, and optional URL",
      "Upload a promotional image (PNG, JPG, WEBP up to 5MB)",
      "Click 'Submit Promotion' to publish",
      "✅ Multiple promotions can be active simultaneously",
    ],
  },
  {
    icon: FileText,
    title: "Promotion Records",
    color: "text-primary",
    bg: "bg-primary/10",
    link: "/dashboard/promote-records",
    instructions: [
      "Navigate to 'Promo Records' tab to see all promotions",
      "Click any promotion to view full details (image, URL, event info)",
      "On the detail page, click 'End Promotion' to stop it",
      "Multiple promotions can run at the same time",
      "Ended promotions remain in records for reference",
    ],
  },
  {
    icon: Building2,
    title: "Organizations",
    color: "text-primary",
    bg: "bg-primary/10",
    link: "/dashboard/organizations",
    instructions: [
      "Navigate to 'Organizations' tab to see all registered orgs",
      "Use the search bar to filter by name, email, or type",
      "Click ✓ to approve or ✗ to reject (with confirmation dialog)",
      "Click any org card to open its full detail page",
      "Detail page shows website, contact person, members, address, etc.",
      "You can change status even after initial approval/rejection",
    ],
  },
  {
    icon: Users,
    title: "Users Management",
    color: "text-primary",
    bg: "bg-primary/10",
    link: "/dashboard/users",
    instructions: [
      "Navigate to 'Users' tab to see all registered users",
      "Use the search bar to filter by name or email",
      "Click shield icon to Block/Unblock a user (with confirmation)",
      "Click trash icon to permanently Remove a user (with confirmation)",
      "User status (Active/Blocked) is shown with colored badges",
    ],
  },
  {
    icon: CheckCircle,
    title: "Approved Organizations",
    color: "text-success",
    bg: "bg-success/10",
    link: "/dashboard/approved",
    instructions: [
      "Navigate to 'Approved' tab to see only approved organizations",
      "Shows detailed cards with description, website, email, members",
      "Click any card to view full organization details",
      "This is a filtered view — manage status from the Organizations tab",
    ],
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const UseCasePage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">How to Use — Guide</h1>
        <p className="text-muted-foreground text-sm mt-1">Step-by-step guide for every feature in the admin dashboard</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4">
        {steps.map((step, idx) => (
          <motion.div key={idx} variants={item}>
            <Card
              className="glass-card cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => navigate(step.link)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl ${step.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <step.icon className={`w-5 h-5 ${step.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-foreground text-base">{step.title}</h3>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    </div>
                    <ol className="mt-3 space-y-1.5">
                      {step.instructions.map((inst, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{inst}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default UseCasePage;
