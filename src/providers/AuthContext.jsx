import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API, signIn as apiSignIn, signUp as apiSignUp } from "../services/API";
import { showToast } from "../components/Toasts/Toasts";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [techListData, setTechListData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoading(true);
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      API.get("profile")
        .then((response) => {
          setUser(response.data);
          setTechListData(response.data.techs);
          localStorage.setItem("user", JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error(
            "Erro ao buscar detalhes do usuário:",
            error.response?.data?.message || error.message
          );
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [navigate]);

  const signIn = async (credentials) => {
    try {
      const response = await apiSignIn(credentials);
      const { user, token } = response;

      setUser(user);
      setTechListData(user.techs);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error("Erro ao fazer login:", error.message);
      showToast(error.response.data.message || "Erro ao fazer login", "error");
      throw error;
    }
  };

  const signUp = async (newUser) => {
    try {
      const response = await apiSignUp(newUser);
      await signIn({ email: newUser.email, password: newUser.password });
    } catch (error) {
      console.error("Erro ao registrar:", error.message);
      showToast(error.response.data.message || "Erro ao registrar", "error");
      throw error;
    }
  };

  const signOut = (navigate) => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete API.defaults.headers.common["Authorization"];

    showToast("Logout realizado com sucesso!", "success");

    if (navigate) {
      navigate("/");
    }
  };

  const login = async (formData) => {
    try {
      await signIn(formData);
      showToast("Login realizado com sucesso!", "success");
      navigate("/user");
    } catch (error) {
      showToast(error.message || "Erro ao fazer login", "error");
    }
  };

  const register = async (formData) => {
    try {
      await signUp(formData);
      showToast("Cadastro realizado com sucesso!", "success");
      navigate("/");
    } catch (error) {
      showToast(error.message || "Erro ao registrar", "error");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        user,
        signIn,
        signUp,
        signOut,
        login,
        register,
        techListData,
        setTechListData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
