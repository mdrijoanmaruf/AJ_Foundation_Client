import { useSession } from "next-auth/react";

export const useUserRole = () => {
  const { data: session, status } = useSession();
  
  const role = (session?.user as any)?.role || null;
  const isAdmin = role === "admin";
  const isUser = role === "user";
  const isLoading = status === "loading";

  return {
    role,
    isAdmin,
    isUser,
    isLoading,
  };
};
