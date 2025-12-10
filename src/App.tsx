import { useRef, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Mapview from "./components/Mapview";
import type { Markerdata } from "./components/MarkerListPanel";
import MarkerListPanel from "./components/MarkerListPanel";
import Login from "./components/Login";
import Signup from "./components/Signup";
import api from "./api/axiosInstance";

function Main() {
  const [markers, setMarkers] = useState<Markerdata[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchMyMemo = async () => {
      try {
        const res = await api.get("/api/memos/my");
        setMarkers(res.data);
      } catch (error) {
        console.error("내 메모 불러오기 실패:", error);
      }
    };

    if (isLoggedIn) {
      fetchMyMemo();
    } else {
      setMarkers([]); 
    }
  }, [isLoggedIn]);

  const handleMarkerClick = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.setCenter(new window.naver.maps.LatLng(lat, lng));
      mapRef.current.setZoom(17);
    }
  };

  const handleDeleteMarker = async (id: number) => {
    if (!isLoggedIn) {
      alert("로그인 후 삭제 가능합니다.");
      return;
    }

    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/api/memos/${id}`);
      setMarkers(prev => prev.filter(m => m.id !== id));
      setDeleteId(id);
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  const handleLogout = async () => {
  try {
    const api = (await import("./api/axiosInstance")).default;

    // 백엔드에서 refreshToken 쿠키 제거 + DB 토큰 무효화
    await api.post("/api/auth/logout");

    // 프론트 accessToken 제거
    localStorage.removeItem("accessToken");

    alert("로그아웃했습니다!");
    navigate("/");
  } catch (e) {
    console.error("로그아웃 실패", e);
  }
};


  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      <nav style={{
        height: "60px", backgroundColor: "#000", color: "white",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px", position: "relative", zIndex: 1000
      }}>
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>MapMemo</div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {!isLoggedIn ? (
            <>
              <button onClick={() => navigate("/login")}>로그인</button>
              <button onClick={() => navigate("/signup")}>회원가입</button>
            </>
          ) : (
            <>
              <button onClick={handleLogout}>로그아웃</button>
              <MarkerListPanel
                markers={markers}
                onMarkerClick={handleMarkerClick}
                onDeleteMarker={handleDeleteMarker}
              />
            </>
          )}
        </div>
      </nav>

      <div style={{ flex: 1, position: "relative" }}>
        <Mapview
          onMarkersChange={() => {}}
          mapRef={mapRef}
          removeMarkerTrigger={deleteId}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
