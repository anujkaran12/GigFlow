import type { ApiResponse, AuthResponse } from "../types";
import { api } from "./api";

const refreshUrl = "/auth/refresh";

export const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", {
    email,
    password,
  });

  if (!response.data.data) throw new Error("Login response was empty");

  return response.data.data;
};

export const register = async (
  name: string,
  email: string,
  password: string,
): Promise<void> => {
  await api.post<ApiResponse<null>>("/auth/register", {
    name,
    email,
    password,
  });
};

export const logout = async (): Promise<void> => {
  await api.post<ApiResponse<null>>("/auth/logout");
};

export const refresh = async (): Promise<void> => {
  await api.post<ApiResponse<null>>(refreshUrl);
};

export const me = async (): Promise<AuthResponse> => {
  const response = await api.get<ApiResponse<AuthResponse>>("/auth/me");

  if (!response.data.data) throw new Error("Session response was empty");

  return response.data.data;
};
