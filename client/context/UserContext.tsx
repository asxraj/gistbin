import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { User } from "../utils/types";

export const UserContext = React.createContext<any>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [jwt, setJwt] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    let t: any = localStorage.getItem("jwt");
    let u: any = localStorage.getItem("user");
    if (t) {
      if (jwt === "") {
        setJwt(t);
        setUser(JSON.parse(u));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    localStorage.removeItem("jwt");
    setJwt("");
    setUser({});
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <UserContext.Provider value={{ jwt, setJwt, user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
