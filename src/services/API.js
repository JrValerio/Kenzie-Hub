import axios from "axios";

const DEFAULT_API_URL = "http://localhost:3333";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "") || DEFAULT_API_URL;

if (import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
  console.warn(
    "VITE_API_URL nao definida. Usando fallback local: http://localhost:3333"
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

export const getUserProfile = (userId) =>
  apiRequest(() => API.get(`users/${userId}`), "Erro ao buscar perfil.");

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
