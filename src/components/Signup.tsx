import { useState } from "react";
import axios from "../api/axiosInstance";

function Signup() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1️⃣ 기본 유효성 검사
    if (!loginId || !password || !passwordConfirm || !name || !email) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    // 2️⃣ 비밀번호 확인
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 3️⃣ 비밀번호 길이 예시
    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    try {
      await axios.post("/api/auth/signup", {
        loginId,
        password,
        name,
        email,
      });

      alert("회원가입 성공!");
      window.location.href = "/login";
    } catch (err: any) {
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
          회원가입
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

          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호 확인"
            className="w-full px-4 py-2 border rounded
                       focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            className="w-full px-4 py-2 border rounded
                       focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
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
          회원가입
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
          이미 계정이 있나요?{" "}
          <a href="/login" className="text-black font-medium hover:underline">
            로그인
          </a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
