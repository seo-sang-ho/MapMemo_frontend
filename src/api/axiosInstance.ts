import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * 🔹 기본 API 인스턴스 (JWT 인터셉터 적용)
 */
const api: AxiosInstance = axios.create({
  baseURL: "https://mapmemo-production.up.railway.app",
  withCredentials: true,
});

/**
 * 🔹 refresh 전용 인스턴스 (인터셉터 ❌)
 */
const refreshApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

/**
 * ======================
 * 요청 인터셉터
 * ======================
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * ======================
 * 응답 인터셉터
 * ======================
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    // 🔴 refresh 요청 자체는 재시도 금지
    if (originalRequest.url?.includes("/api/auth/refresh")) {
      return Promise.reject(error);
    }

    // 🔴 401만 refresh 시도 (403은 보안상 재시도 ❌)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res: AxiosResponse<string> =
          await refreshApi.post("/api/auth/refresh");

        const newAccessToken = res.data;
        localStorage.setItem("accessToken", newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization =
            `Bearer ${newAccessToken}`;
        }

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
