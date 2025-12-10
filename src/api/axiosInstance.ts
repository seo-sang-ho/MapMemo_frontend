import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// 🔹 refresh api는 인터셉터를 타지 않는 별도 인스턴스
const refreshApi = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use(config => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  response => response,

  async error => {
    const originalRequest = error.config;

    // ⛔ refresh 요청에서 에러났을 때는 재시도하면 안됨
    if (originalRequest.url.includes("/api/auth/refresh")) {
      return Promise.reject(error);
    }

    // ⛔ 401에서만 refresh 시도 (403은 retry 절대 금지)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refresh는 별도 axios로 요청해야 함
        const res = await refreshApi.post("/api/auth/refresh");
        const newAccessToken = res.data;

        // 토큰 저장
        localStorage.setItem("accessToken", newAccessToken);

        // 재요청에 토큰 반영
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // 🔥 refresh 실패 → 완전히 로그인 해제된 상태
        localStorage.removeItem("accessToken");

        // UI에 로그아웃 상태로 반영할 수 있도록 reject
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
