import type { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AppProvider;
