"use client"
import { createContext, ReactNode, useContext } from "react";
import { adminProps} from "../interface/user";


interface AdminContextType{
    user: adminProps | null
}

const UserContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({user, children} : { user: adminProps | null, children: React.ReactNode}) {
  return(
    <UserContext.Provider value={{ user }}>
      { children }
    </UserContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(UserContext);

  if(!context){
    throw new Error("useUser must be used inside userProvider");
  };

  return context
}