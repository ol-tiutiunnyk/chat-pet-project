
import { FC, PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useGetUserQuery } from "@/slices/auth.api";

const RequireAuth: FC<PropsWithChildren> = ({ children }) => {
  const { data: user, isLoading, isUninitialized } = useGetUserQuery();
  const location = useLocation();

  if (!user && !isLoading && !isUninitialized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export default RequireAuth;
