import { User } from "@/contexts/AuthProvider";
import { supabase } from "@/lib/supabase";

export const usersFetcher = async ({ from, to }: { from: number; to: number }): Promise<User[]> => {
  const { data, error } = await supabase.from("profiles").select("*").range(from, to);
  if (error) throw error;
  return data;
};
