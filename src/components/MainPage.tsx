// src/pages/HomePage.tsx
import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Mapview from "./Mapview";
import type { Markerdata } from "./MarkerListPanel";
import MarkerListPanel from "./MarkerListPanel";
import api from "../api/axiosInstance";

export default function MainPage() {
  const [markers, setMarkers] = useState<Markerdata[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const navigate = useNavigate();

  // 페이지 로드 시 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  // 로그인 상태 변경될 때 마커 다시 로드
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
      await api.post("/api/auth/logout");

      localStorage.removeItem("accessToken");

      setIsLoggedIn(false);
      setMarkers([]);
      setDeleteId(null);

      alert("로그아웃했습니다!");
      navigate("/");
    } catch (e) {
      console.error("로그아웃 실패", e);
    }
  };

  const handleMarkersChange = useCallback((newMarkers: Markerdata[]) => {
  setMarkers(newMarkers);
}, []);

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navigation Bar */}
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

      {/* 지도 영역 */}
      <div style={{ flex: 1, position: "relative" }}>
        <Mapview
          onMarkersChange={handleMarkersChange}
          mapRef={mapRef}
          removeMarkerTrigger={deleteId}
        />
      </div>
    </div>
  );
}
