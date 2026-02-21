import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Update {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
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
  owner_id: string;
  name: string;
  ein: string | null;
  website_url: string | null;
  mission: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  tags: string[] | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  profile_picture: string | null;
  location: string | null;
  block: boolean;
  created_at: string;
}

interface DataContextType {
  updates: Update[];
  loadingUpdates: boolean;
  addUpdate: (u: Omit<Update, "id" | "createdAt" | "status">) => Promise<boolean>;
  endUpdate: (id: string) => Promise<void>;
  refetchUpdates: () => Promise<void>;
  promotions: Promotion[];
  loadingPromotions: boolean;
  addPromotion: (p: Omit<Promotion, "id" | "createdAt" | "status">) => Promise<void>;
  endPromotion: (id: string) => Promise<void>;
  refetchPromotions: () => Promise<void>;
  organizations: Organization[];
  loadingOrgs: boolean;
  refetchOrgs: () => Promise<void>;
  setOrgVerified: (id: string, is_verified: boolean) => Promise<void>;
  users: User[];
  loadingUsers: boolean;
  refetchUsers: () => Promise<void>;
  toggleUserBlock: (id: string) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

// profiles table row
type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  profile_picture: string | null;
  location: string | null;
  block: boolean | null;
  created_at: string;
};
function mapProfileRow(row: ProfileRow): User {
  return {
    id: row.id,
    email: row.email ?? "",
    full_name: row.full_name ?? null,
    username: row.username ?? null,
    bio: row.bio ?? null,
    profile_picture: row.profile_picture ?? null,
    location: row.location ?? null,
    block: row.block ?? false,
    created_at: row.created_at,
  };
}

// DB row types for Supabase
type UpdatesRow = { id: string; title: string; subtitle: string | null; description: string | null; features: string[] | null; is_active: boolean; created_at: string };
type PromotionsRow = { id: string; organizer_name: string; url: string | null; event_details: string; additional_info: string | null; image_url: string | null; is_active: boolean; created_at: string };

function mapUpdateRow(row: UpdatesRow): Update {
  return { id: row.id, title: row.title, subtitle: row.subtitle ?? "", description: row.description ?? undefined, features: row.features ?? [], status: row.is_active ? "active" : "ended", createdAt: row.created_at };
}
function mapPromoRow(row: PromotionsRow): Promotion {
  return { id: row.id, organizer: row.organizer_name, eventDetails: row.event_details, additionalInfo: row.additional_info ?? "", url: row.url ?? undefined, imageUrl: row.image_url ?? undefined, status: row.is_active ? "active" : "ended", createdAt: row.created_at };
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [loadingPromotions, setLoadingPromotions] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const refetchUpdates = useCallback(async () => {
    setLoadingUpdates(true);
    const { data, error } = await supabase.from("updates").select("id,title,subtitle,description,features,is_active,created_at").order("created_at", { ascending: false });
    setLoadingUpdates(false);
    if (!error && data) setUpdates((data as UpdatesRow[]).map(mapUpdateRow));
  }, []);

  const refetchPromotions = useCallback(async () => {
    setLoadingPromotions(true);
    const { data, error } = await supabase.from("promotions").select("id,organizer_name,url,event_details,additional_info,image_url,is_active,created_at").order("created_at", { ascending: false });
    setLoadingPromotions(false);
    if (!error && data) setPromotions((data as PromotionsRow[]).map(mapPromoRow));
  }, []);

  const refetchOrgs = useCallback(async () => {
    setLoadingOrgs(true);
    console.log("[Organizations] Fetching from Supabase...");
    const { data, error } = await supabase.from("organizations").select("*").order("created_at", { ascending: false });
    console.log("[Organizations] Response:", { data, error, count: data?.length ?? 0 });
    if (error) console.error("[Organizations] Supabase error:", error.message, error.details);
    setLoadingOrgs(false);
    if (!error && data) {
      setOrganizations((data as Organization[]));
      console.log("[Organizations] Set state, count:", data.length);
      if (data.length === 0) console.warn("[Organizations] Got 0 rows. If table has data in Supabase, enable RLS policy for SELECT on 'organizations' (Table → RLS policies).");
    } else {
      console.log("[Organizations] No data set (error or empty)");
    }
  }, []);

  const refetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,full_name,username,bio,profile_picture,location,block,created_at")
      .order("created_at", { ascending: false });
    setLoadingUsers(false);
    if (!error && data) setUsers((data as ProfileRow[]).map(mapProfileRow));
  }, []);

  useEffect(() => { refetchOrgs(); }, [refetchOrgs]);
  useEffect(() => { refetchUpdates(); }, [refetchUpdates]);
  useEffect(() => { refetchPromotions(); }, [refetchPromotions]);
  useEffect(() => { refetchUsers(); }, [refetchUsers]);

  const setOrgVerified = useCallback(async (id: string, is_verified: boolean) => {
    const { error } = await supabase.from("organizations").update({ is_verified, updated_at: new Date().toISOString() }).eq("id", id);
    if (!error) setOrganizations(prev => prev.map(o => o.id === id ? { ...o, is_verified, updated_at: new Date().toISOString() } : o));
  }, []);

  const addUpdate = useCallback(async (u: Omit<Update, "id" | "createdAt" | "status">): Promise<boolean> => {
    const hasActive = updates.some(up => up.status === "active");
    if (hasActive) return false;
    const { error } = await supabase.from("updates").insert({ title: u.title, subtitle: u.subtitle, description: (u as Update).description ?? null, features: u.features, is_active: true });
    if (error) return false;
    await refetchUpdates();
    return true;
  }, [updates, refetchUpdates]);

  const endUpdate = useCallback(async (id: string) => {
    await supabase.from("updates").update({ is_active: false, updated_at: new Date().toISOString() }).eq("id", id);
    await refetchUpdates();
  }, [refetchUpdates]);

  const addPromotion = useCallback(async (p: Omit<Promotion, "id" | "createdAt" | "status">) => {
    await supabase.from("promotions").insert({ organizer_name: p.organizer, url: p.url ?? null, event_details: p.eventDetails, additional_info: p.additionalInfo ?? null, image_url: p.imageUrl ?? null, is_active: true });
    await refetchPromotions();
  }, [refetchPromotions]);

  const endPromotion = useCallback(async (id: string) => {
    await supabase.from("promotions").update({ is_active: false, updated_at: new Date().toISOString() }).eq("id", id);
    await refetchPromotions();
  }, [refetchPromotions]);

  const toggleUserBlock = useCallback(async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    const newBlock = !user.block;
    const { error } = await supabase.from("profiles").update({ block: newBlock }).eq("id", id);
    if (!error) setUsers(prev => prev.map(u => u.id === id ? { ...u, block: newBlock } : u));
  }, [users]);

  const removeUser = useCallback(async (id: string) => {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (!error) setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  return (
    <DataContext.Provider value={{ updates, loadingUpdates, addUpdate, endUpdate, refetchUpdates, promotions, loadingPromotions, addPromotion, endPromotion, refetchPromotions, organizations, loadingOrgs, refetchOrgs, setOrgVerified, users, loadingUsers, refetchUsers, toggleUserBlock, removeUser }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
