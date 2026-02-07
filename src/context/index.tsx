import type { ReactNode } from "react";
import { Authprovider } from "./AuthContext";

const AppProvider = ({ children }: { children: ReactNode }) => {
  return <Authprovider>{children}</Authprovider>;
};

export default AppProvider;
