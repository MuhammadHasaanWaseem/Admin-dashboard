import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import Index from "./pages/Index";
import DashboardIndex from "./pages/dashboard/DashboardIndex";
import UpdatesPage from "./pages/dashboard/UpdatesPage";
import PromotePage from "./pages/dashboard/PromotePage";
import OrganizationsPage from "./pages/dashboard/OrganizationsPage";
import OrganizationDetailPage from "./pages/dashboard/OrganizationDetailPage";
import UsersPage from "./pages/dashboard/UsersPage";
import ApprovedPage from "./pages/dashboard/ApprovedPage";
import UpdateRecordsPage from "./pages/dashboard/UpdateRecordsPage";
import UpdateDetailPage from "./pages/dashboard/UpdateDetailPage";
import PromoteRecordsPage from "./pages/dashboard/PromoteRecordsPage";
import PromoteDetailPage from "./pages/dashboard/PromoteDetailPage";
import UseCasePage from "./pages/dashboard/UseCasePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardIndex />} />
                <Route path="updates" element={<UpdatesPage />} />
                <Route path="promote" element={<PromotePage />} />
                <Route path="organizations" element={<OrganizationsPage />} />
                <Route path="organizations/:id" element={<OrganizationDetailPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="approved" element={<ApprovedPage />} />
                <Route path="update-records" element={<UpdateRecordsPage />} />
                <Route path="update-records/:id" element={<UpdateDetailPage />} />
                <Route path="promote-records" element={<PromoteRecordsPage />} />
                <Route path="promote-records/:id" element={<PromoteDetailPage />} />
                <Route path="guide" element={<UseCasePage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
