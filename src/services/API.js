import axios from "axios";

export const API = axios.create({
  baseURL: "https://kenziehub.herokuapp.com/",
  timeout: 5000,
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


