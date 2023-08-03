import { createContext, useContext, useState } from "react";

const AccountContext = createContext();

export function AccountProvider({ children }) {
  const [account, setAccount] = useState(null);
  return (
    <AccountContext.Provider value={[account, setAccount]}>{children}</AccountContext.Provider>
  );
}

export function useAccountContext() {
  return useContext(AccountContext);
}