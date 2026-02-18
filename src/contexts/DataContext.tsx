import React, { createContext, useContext, useState, useCallback } from "react";

export interface Update {
  id: string;
  title: string;
  subtitle: string;
  features: string[];
  status: "active" | "ended";
  createdAt: string;
}

export interface Promotion {
  id: string;
  organizer: string;
  eventDetails: string;
  additionalInfo: string;
  url?: string;
  imageUrl?: string;
  status: "active" | "ended";
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  description: string;
  contactPerson: string;
  type: string;
  memberCount: number;
  status: "pending" | "approved" | "rejected";
  registeredAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "blocked";
  joinedAt: string;
}

interface DataContextType {
  updates: Update[];
  addUpdate: (u: Omit<Update, "id" | "createdAt" | "status">) => boolean;
  endUpdate: (id: string) => void;
  promotions: Promotion[];
  addPromotion: (p: Omit<Promotion, "id" | "createdAt" | "status">) => void;
  endPromotion: (id: string) => void;
  organizations: Organization[];
  updateOrgStatus: (id: string, status: "approved" | "rejected") => void;
  users: User[];
  toggleUserBlock: (id: string) => void;
  removeUser: (id: string) => void;
}

const DataContext = createContext<DataContextType | null>(null);

const sampleOrgs: Organization[] = [
  { id: "1", name: "TechCorp Solutions", email: "info@techcorp.com", phone: "+1 555-0101", address: "123 Tech Lane, San Francisco, CA", website: "https://techcorp.com", description: "Leading provider of enterprise software solutions and cloud infrastructure services.", contactPerson: "James Miller", type: "Technology", memberCount: 120, status: "pending", registeredAt: "2025-01-15" },
  { id: "2", name: "Green Earth NGO", email: "contact@greenearth.org", phone: "+1 555-0102", address: "456 Green St, New York, NY", website: "https://greenearth.org", description: "Environmental conservation organization focused on urban sustainability and reforestation projects.", contactPerson: "Sarah Chen", type: "Non-Profit", memberCount: 45, status: "approved", registeredAt: "2025-01-10" },
  { id: "3", name: "EduLearn Academy", email: "hello@edulearn.com", phone: "+1 555-0103", address: "789 Edu Ave, Los Angeles, CA", website: "https://edulearn.com", description: "Online education platform offering certified courses in technology and business management.", contactPerson: "Michael Torres", type: "Education", memberCount: 200, status: "pending", registeredAt: "2025-02-01" },
  { id: "4", name: "HealthPlus Clinic", email: "admin@healthplus.com", phone: "+1 555-0104", address: "321 Health Blvd, Chicago, IL", website: "https://healthplus.com", description: "Multi-specialty healthcare clinic providing telemedicine and in-person consultations.", contactPerson: "Dr. Lisa Wang", type: "Healthcare", memberCount: 35, status: "rejected", registeredAt: "2024-12-20" },
];

const sampleUsers: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", phone: "+1 555-1001", status: "active", joinedAt: "2025-01-05" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", phone: "+1 555-1002", status: "active", joinedAt: "2025-01-12" },
  { id: "3", name: "Carol Williams", email: "carol@example.com", phone: "+1 555-1003", status: "blocked", joinedAt: "2025-01-20" },
  { id: "4", name: "David Brown", email: "david@example.com", phone: "+1 555-1004", status: "active", joinedAt: "2025-02-01" },
  { id: "5", name: "Eva Martinez", email: "eva@example.com", phone: "+1 555-1005", status: "active", joinedAt: "2025-02-10" },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>(sampleOrgs);
  const [users, setUsers] = useState<User[]>(sampleUsers);

  // Only 1 update can be added at a time (must end previous active one first)
  const addUpdate = useCallback((u: Omit<Update, "id" | "createdAt" | "status">) => {
    const hasActive = updates.some(up => up.status === "active");
    if (hasActive) return false;
    setUpdates(prev => [{ ...u, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: "active" }, ...prev]);
    return true;
  }, [updates]);

  const endUpdate = useCallback((id: string) => {
    setUpdates(prev => prev.map(u => u.id === id ? { ...u, status: "ended" as const } : u));
  }, []);

  // Multiple promotions can be active at the same time
  const addPromotion = useCallback((p: Omit<Promotion, "id" | "createdAt" | "status">) => {
    setPromotions(prev => [{ ...p, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: "active" }, ...prev]);
  }, []);

  const endPromotion = useCallback((id: string) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, status: "ended" as const } : p));
  }, []);

  const updateOrgStatus = useCallback((id: string, status: "approved" | "rejected") => {
    setOrganizations(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }, []);

  const toggleUserBlock = useCallback((id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u));
  }, []);

  const removeUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  return (
    <DataContext.Provider value={{ updates, addUpdate, endUpdate, promotions, addPromotion, endPromotion, organizations, updateOrgStatus, users, toggleUserBlock, removeUser }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
