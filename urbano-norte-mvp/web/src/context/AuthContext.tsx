import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

interface UserRegister {
  id: string;
  name: string;
  email: string;
  password?: string;
  confirmpassword?: string;
  phone: string;
}

interface UserData {
  id: string;
  name: string;
}

interface AuthContextType {
  user?: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (user: UserRegister) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext) as AuthContextType;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);

  const route = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await API.get("/users/checkuser", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { id } = response.data;

          if (response.data.id) {
            const userResponse = await API.get(`/users/${id}`);
            const userData = userResponse.data;
            setUser(userData.user);
            route("/");
          }
        } catch (error) {
          console.error("Erro ao verificar autenticação:", error);
          localStorage.removeItem("token");
          setUser(null);
          route("/login");
        }
      } else {
        route("/login");
        setUser(null);
      }
    };

    checkAuthentication();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await API.post("/users/login", { email, password });
      const { token, userId } = response.data;

      localStorage.setItem("token", token);

      const userResponse = await API.get(`/users/${userId}`);
      const userData = userResponse.data;

      setUser(userData.user);
      localStorage.setItem("user", JSON.stringify(userData.user));
      route("/");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const register = async (_user: UserRegister) => {
    try {
      const response = await API.post("/users/register", _user);

      const { token, userId } = response.data;

      localStorage.setItem("token", token);

      const userResponse = await API.get(`/users/${userId}`);

      const userData = userResponse.data;
      setUser(userData.user);
      localStorage.setItem("user", JSON.stringify(userData.user));
    } catch (error) {
      console.error("Erro ao registrar:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    route("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
