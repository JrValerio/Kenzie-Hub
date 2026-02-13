import axios from "axios";

const DEV_API_URL = "http://localhost:3333";
const PROD_FALLBACK_API_URL = "https://kenzie-hub-production.up.railway.app";
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");
const fallbackApiUrl = import.meta.env.DEV ? DEV_API_URL : PROD_FALLBACK_API_URL;

export const API_BASE_URL = configuredApiUrl || fallbackApiUrl;

if (!configuredApiUrl) {
  console.warn(
    `VITE_API_URL nao definida. Usando fallback: ${fallbackApiUrl}`
  );
}

export const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const mapApiError = (error, fallbackMessage) => {
  if (!error.response && error.message === "Network Error") {
    return new Error(
      `Falha de conexao com a API (${API_BASE_URL}). Verifique o VITE_API_URL.`
    );
  }

  const responseMessage = error.response?.data?.message;
  const message = responseMessage || error.message || fallbackMessage;
  const mappedError = new Error(message);

  mappedError.status = error.response?.status;
  mappedError.payload = error.response?.data;

  return mappedError;
};

const apiRequest = async (request, fallbackMessage) => {
  try {
    const response = await request();
    return response.data;
  } catch (error) {
    throw mapApiError(error, fallbackMessage);
  }
};

export const signIn = (credentials) =>
  apiRequest(() => API.post("sessions", credentials), "Erro ao fazer login.");

export const signUp = (newUser) =>
  apiRequest(() => API.post("users", newUser), "Erro ao cadastrar usuario.");

export const addTech = (newTech) =>
  apiRequest(
    () => API.post("users/techs", newTech),
    "Erro ao adicionar tecnologia."
  );

export const updateTech = (techId, updatedTech) =>
  apiRequest(
    () => API.put(`users/techs/${techId}`, updatedTech),
    "Erro ao atualizar tecnologia."
  );

export const deleteTech = (techId) =>
  apiRequest(
    () => API.delete(`users/techs/${techId}`),
    "Erro ao excluir tecnologia."
  );
