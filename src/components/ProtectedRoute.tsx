import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { authUser, checkAuth } = useAuthStore();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Run auth check only once on component mount
  useEffect(() => {
    const verifyAuth = async () => {
      if (!authUser) {
        await checkAuth();
      }
      setInitialCheckDone(true);
    };

    verifyAuth();
  }, []); // Empty dependency array to run only once

  // Show loading only during initial check
  if (!initialCheckDone) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  // After initial check, redirect if no user
  if (!authUser) {
    console.log("No auth user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
if (allowedRoles && authUser && typeof authUser.role === 'function') {
 // Check if user has one of the allowed roles
  const hasAllowedRole = allowedRoles.some(role => authUser.role(role));
  if (!hasAllowedRole) {
    return <Navigate to="/" replace />;
  }
}



  return <>{children}</>;
};

export default ProtectedRoute;
