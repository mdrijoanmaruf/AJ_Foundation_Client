import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const useUserRole = () => {
  const { data: session, status } = useSession();
  
  const role = (session?.user as any)?.role || null;
  const isAdmin = role === "admin";
  const isUser = role === "user";
  const isLoading = status === "loading";

  useEffect(() => {
    if (session) {
      console.log("useUserRole Hook:", {
        email: session.user?.email,
        role: role,
        isAdmin: isAdmin,
        rawSession: session
      });
    }
  }, [session, role, isAdmin]);

  return {
    role,
    isAdmin,
    isUser,
    isLoading,
  };
};
