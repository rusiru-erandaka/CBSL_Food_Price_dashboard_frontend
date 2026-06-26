import axios, { AxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/api";

export class ApiError extends Error {
  status?: number;
  code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const configuredBaseURL = import.meta.env.VITE_API_BASE_URL?.trim();

// In local Vite development, prefer the dev proxy for absolute API URLs to avoid CORS issues.
const baseURL =
  import.meta.env.DEV && (!configuredBaseURL || /^https?:\/\//.test(configuredBaseURL))
    ? "/"
    : configuredBaseURL || "/";

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.data?.message) {
      return Promise.reject(
        new ApiError(
          error.response.data.message,
          error.response.status,
          error.response.data.error,
        ),
      );
    }

    if (error.code === "ECONNABORTED") {
      return Promise.reject(new ApiError("Request timed out. Please try again."));
    }

    if (error.message) {
      return Promise.reject(
        new ApiError(error.message, error.response?.status, error.code),
      );
    }

    return Promise.reject(new ApiError("Unexpected API error."));
  },
);
