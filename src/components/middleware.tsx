// components/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // ✅ Correct for Pages Router
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // ✅ Only access localStorage in useEffect (client-side only)
    const checkAuth = () => {
      try {
        // Check if we're in the browser
        if (typeof window !== "undefined") {
          const authStatus = localStorage.getItem("isAuthenticated");
          
          if (authStatus === "true") {
            setIsAuthenticated(true);
            setIsLoading(false);
          } else {
            router.replace("/register");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.replace("/register");
      }
    };

    checkAuth();
  }, [router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirecting)
  if (!isAuthenticated) {
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
}