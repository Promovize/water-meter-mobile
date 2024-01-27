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
    .from("history")
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
