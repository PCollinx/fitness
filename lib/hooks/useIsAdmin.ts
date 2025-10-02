"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useIsAdmin() {
  const { data: session, status } = useSession();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (status === "loading") {
        setIsLoading(true);
        return;
      }

      if (!session?.user?.email) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/check-admin");
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [session, status]);

  return { isAdmin, isLoading, isAuthenticated: !!session };
}
