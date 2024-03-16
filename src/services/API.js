import axios from "axios";

export const API = axios.create({
  baseURL: "https://kenziehub.herokuapp.com/",
  timeout: 5000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signIn = async (credentials) => {
  try {
    const response = await API.post("sessions", credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const signUp = async (newUser) => {
  try {
    const response = await API.post("users", newUser);
    return response.data;
  } catch (error) {
    console.log("Erro na API:", error.response.data);

    throw error.response.data;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await API.get(`users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addTech = async (newTech) => {
  try {
    const response = await API.post("/users/techs", newTech);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateTech = async (techId, updatedTech) => {
  try {
    const response = await API.put(`/users/techs/${techId}`, updatedTech);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteTech = async (techId) => {
  try {
    const response = await API.delete(`/users/techs/${techId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
