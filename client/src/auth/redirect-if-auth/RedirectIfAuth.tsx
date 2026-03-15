import { useGetUserQuery } from "@/slices/auth.api";
import { FC, PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";

const RedirectIfAuth: FC<PropsWithChildren> = ({ children }) => {
  const { data: user, isLoading, isUninitialized } = useGetUserQuery();
  const location = useLocation();

  if (user && !isLoading && !isUninitialized) {
    return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  }
  return <>{children}</>;
};

export default RedirectIfAuth;
