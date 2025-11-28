import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // RefreshToken 쿠키를 위해 필요
});

// 요청 시 AccessToken 자동 첨부
api.interceptors.request.use(
  (config) => {
    // 로그인/회원가입/리프레시 요청에는 토큰 제외
    if (
      config.url?.startsWith("/api/auth/login") ||
      config.url?.startsWith("/api/auth/signup") ||
      config.url?.startsWith("/api/auth/refresh")
    ) {
      return config;
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: AccessToken 만료 시 refreshToken으로 재발급
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh Token으로 Access Token 재발급
        const res = await api.post("/api/auth/refresh");
        const newAccessToken = res.data;

        // 새 토큰 저장
        localStorage.setItem("accessToken", newAccessToken);

        // 원래 요청 헤더에 새 토큰 적용 후 재시도
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh Token도 만료되면 로그아웃 처리
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
