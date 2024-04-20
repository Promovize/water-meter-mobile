import { User } from "@/contexts/AuthProvider";
import { supabase } from "@/lib/supabase";

export const usersFetcher = async ({
  from,
  to,
}: {
  from: number;
  to: number;
}): Promise<User[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .range(from, to);
  if (error) throw error;
  return data;
};

export const getSingleUser = async (id: string): Promise<User> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const getHistory = async (userId: string): Promise<any> => {
  const { data, error } = await supabase
    .from("scan_history")
    .select("*, meter_numbers(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getUserCounters = async (userId: string): Promise<any> => {
  const { data, error } = await supabase
    .from("meter_numbers")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getInvoices = async (userId: string): Promise<any> => {
  const { data, error } = await supabase
    .from("invoices")
    .select("*, meter_numbers(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getAllLeakages = async ({
  from,
  to,
}: {
  from: number;
  to: number;
}): Promise<any> => {
  const { data, error } = await supabase
    .from("leakages")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return data;
};

export const getSingleLeakage = async (id: string): Promise<any> => {
  const { data, error } = await supabase
    .from("leakages")
    .select("*")
    .eq("id", id);

  if (error) throw error;
  return data[0];
};

export const getClaims = async (): Promise<any> => {
  const { data, error } = await supabase
    .from("claims")
    .select("*, scan:scan_history(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
