import { useRef, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Mapview from "./components/Mapview";
import type { Markerdata } from "./components/MarkerListPanel";
import MarkerListPanel from "./components/MarkerListPanel";
import Login from "./components/Login";
import Signup from "./components/Signup";

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
        const api = (await import("./api/axiosInstance")).default;

        const res = await api.get("/api/memos/my"); // 🔥 내 메모만 조회하는 API 호출
        setMarkers(res.data);
      } catch (error) {
        console.error("메모 불러오기 실패:", error);
      }
    };

    if (isLoggedIn) {
      fetchMyMemo();
    }
  }, [isLoggedIn]);

  const handleMarkerClick = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.setCenter(new window.naver.maps.LatLng(lat, lng));
      mapRef.current.setZoom(17);
    }
  };

  const handleDeleteMarker = async (id: number) => {
    if (!localStorage.getItem("accessToken")) {
      alert("로그인 후 삭제 가능합니다.");
      return;
    }

    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const api = (await import("./api/axiosInstance")).default;
      await api.delete(`/api/memos/${id}`);

      setMarkers(prev => prev.filter(m => m.id !== id));
      setDeleteId(id);
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setMarkers([]); // 내 메모 비움
    navigate("/login");
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
          onMarkersChange={setMarkers}
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
