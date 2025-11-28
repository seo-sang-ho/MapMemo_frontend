import { useState } from "react";
import axios from "../api/axiosInstance";

function Login() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/login", {
        loginId,
        password,
      });

      const accessToken = res.data; // 백엔드가 accessToken 문자열로 반환 중
      localStorage.setItem("accessToken", accessToken);

      alert("로그인 성공!");
      window.location.href = "/"; // 메인 화면으로 이동
    } catch (err) {
      alert("로그인 실패");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>로그인</h2>
      <input value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="아이디" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
      <button type="submit">로그인</button>
    </form>
  );
}

export default Login;
