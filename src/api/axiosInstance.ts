import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // RefreshToken 쿠키 쓰려면 반드시 필요
});

// 요청 시 AccessToken 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
