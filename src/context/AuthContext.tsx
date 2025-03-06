import { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
  accessToken: string | null;
  userData: {
    email: string;
    firstname: string;
    lastname: string;
    username: string;
  } | null;
  login: (data: any) => void;
  logout: () => void;
  setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken") || null
  );
  const [userData, setUserData] = useState<AuthContextType["userData"] | null>(
    localStorage.getItem("userDetails")
      ? JSON.parse(localStorage.getItem("userDetails")!)
      : null
  );

  const login = (data: any) => {
    setAccessToken(data.accessToken);
    setUserData({
      email: data.userData.email,
      firstname: data.userData.firstname,
      lastname: data.userData.lastname,
      username: data.userData.username,
    });

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("userDetails", JSON.stringify(data.userData));
  };

  const logout = () => {
    setAccessToken(null);
    setUserData(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("userDetails");

    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, userData, login, logout, setAccessToken }} // Expose setAccessToken
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
