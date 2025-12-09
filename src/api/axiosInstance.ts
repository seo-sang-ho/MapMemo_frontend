import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // 쿠키 전송 허용
});

// 요청 인터셉터: 토큰 자동 설정
api.interceptors.request.use(config => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers!["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 인터셉터: 401,403 → refresh 토큰으로 재발급
api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    if (err.response.status === 401 || err.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { data: newAccessToken } = await api.post("/api/auth/refresh");
      localStorage.setItem("accessToken", newAccessToken);
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    }
    return Promise.reject(err);
  }
);

export default api;
