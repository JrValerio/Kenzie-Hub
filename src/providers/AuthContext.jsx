import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { API, signIn as apiSignIn, signUp as apiSignUp } from "../services/API";
import { showToast } from "../utils/toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [techListData, setTechListData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthReady(true);
      return;
    }

    setLoading(true);
    API.defaults.headers.common.Authorization = `Bearer ${token}`;

    API.get("profile")
      .then((response) => {
        setUser(response.data);
        setTechListData(response.data.techs);
        localStorage.setItem("user", JSON.stringify(response.data));
      })
      .catch((error) => {
        console.error("Erro ao buscar detalhes do usuario:", error.message);
        setUser(null);
        setTechListData([]);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete API.defaults.headers.common.Authorization;
      })
      .finally(() => {
        setLoading(false);
        setAuthReady(true);
      });
  }, []);

  const signIn = async (credentials) => {
    try {
      const response = await apiSignIn(credentials);
      const { user, token } = response;

      setUser(user);
      setTechListData(user.techs);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      API.defaults.headers.common.Authorization = `Bearer ${token}`;
      setAuthReady(true);
    } catch (error) {
      console.error("Erro ao fazer login:", error.message);
      throw error;
    }
  };

  const signUp = async (newUser) => {
    try {
      await apiSignUp(newUser);
      await signIn({ email: newUser.email, password: newUser.password });
    } catch (error) {
      console.error("Erro ao registrar:", error.message);
      throw error;
    }
  };

  const signOut = (routerNavigate) => {
    setUser(null);
    setTechListData([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete API.defaults.headers.common.Authorization;
    setAuthReady(true);

    showToast("Logout realizado com sucesso!", "success");

    if (routerNavigate) {
      routerNavigate("/");
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
        authReady,
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

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
