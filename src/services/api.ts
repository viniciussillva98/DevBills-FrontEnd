import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { firebaseAuth } from "../config/firebase";

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Abaixo adiciona um interceptor para incluir o token de autenticação em cada requisição
api.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    const user = firebaseAuth.currentUser;

    if (user) {
      try {
        const token = await user.getIdToken(); //Pega o token do usuário logado
        config.headers.set("Authorization", `Bearer ${token}`); //Adiciona o token no cabeçalho da requisição
      } catch (error) {
        console.error("Erro ao obter o token do Firebase:", error);
      }
    }

    return config;
  },
);
