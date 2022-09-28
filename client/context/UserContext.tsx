import React, { useState, useEffect } from "react";

export const UserContext = React.createContext<any>(undefined);

interface User {
  ID?: number;
  Username?: string;
  Email?: string;
}

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [jwt, setJwt] = useState<string>("");

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
  };

  return (
    <UserContext.Provider value={{ jwt, setJwt, user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
