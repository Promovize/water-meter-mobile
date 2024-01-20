import { Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "expo-router";
import { Route } from "@/constants/Route";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  session: Session | null;
};

const AuthContext = React.createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = React.useContext(AuthContext) as AuthContextType;
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

type Props = {
  children: React.ReactNode | ((props: AuthContextType) => React.ReactNode);
};

export type User = {
  id: string;
  username: string;
  website: string;
  avatar_url: string;
  full_name: string;
};

const AuthProvider = (props: Props) => {
  const { children } = props;
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<User | any>(null);
  const [session, setSession] = useState<Session | null>(null);
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { user } = session;
      const userId = user.id;

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`id, username, website, avatar_url, full_name`)
        .eq("id", userId)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setProfile(data);
        router.replace(Route.Home);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
        if (pathName !== Route.Login && pathName !== Route.Welcome) {
          router.push(Route.Login);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  const value = {
    user: profile,
    loading,
    session,
  };

  console.log({ profile });

  return (
    <AuthContext.Provider value={value}>
      {typeof children === "function" ? children(value) : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
