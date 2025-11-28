import { useState } from "react";
import axios from "../api/axiosInstance";

function Signup() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/api/auth/signup", {
        loginId,
        password,
        name,
        email,
      });
      alert("회원가입 성공!");
      window.location.href = "/login";
    } catch (err) {
      alert("회원가입 실패");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>회원가입</h2>
      <input value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder="아이디" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" />
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="이름" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일" />

      <button type="submit">회원가입</button>
    </form>
  );
}

export default Signup;
