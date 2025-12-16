import { useState } from "react";
import axios from "../api/axiosInstance";

function Login() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1️⃣ 기본 유효성 검사
    if (!loginId || !password) {
      setError("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/login", {
        loginId,
        password,
      });

      const accessToken = res.data; // accessToken 문자열
      localStorage.setItem("accessToken", accessToken);

      window.location.href = "/";
    } catch (err) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          로그인
        </h2>

        <div className="space-y-4">
          <input
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="아이디"
            className="w-full px-4 py-2 border rounded
                       focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full px-4 py-2 border rounded
                       focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* ❗ 에러 메시지 */}
        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full mt-6 bg-black text-white py-2 rounded
                     hover:bg-gray-800 transition"
        >
          로그인
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
          아직 계정이 없나요?{" "}
          <a href="/signup" className="text-black font-medium hover:underline">
            회원가입
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
