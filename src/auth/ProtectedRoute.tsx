import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { Spinner } from "@chakra-ui/react";

interface IProps {
  children: ReactNode;
  goto?: string;
  isAllowed: boolean;
  isLoading?: boolean;
}

const ProtectedRoute = ({
  children,
  isAllowed,
  goto = "/",
  isLoading = false,
}: IProps) => {
  const location = useLocation();

  if (isLoading) return <Spinner />;

  if (!isAllowed) {
    return <Navigate to={goto} replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
