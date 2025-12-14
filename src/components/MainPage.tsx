import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Mapview from "./Mapview";
import type { Markerdata } from "./MarkerListPanel";
import api from "../api/axiosInstance";
import NavBar from "../components/NavBar";

export default function MainPage() {
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

    if (isLoggedIn) fetchMyMemo();
    else setMarkers([]);
  }, [isLoggedIn]);

  const handleMarkerClick = (lat: number, lng: number) => {
    if (!mapRef.current) return;
    mapRef.current.setCenter(new window.naver.maps.LatLng(lat, lng));
    mapRef.current.setZoom(17);
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
      <NavBar
        isLoggedIn={isLoggedIn}
        markers={markers}
        onLogout={handleLogout}
        onMarkerClick={handleMarkerClick}
        onDeleteMarker={handleDeleteMarker}
      />

      <div style={{ flex: 1, position: "relative" }}>
        <Mapview
          isLoggedIn={isLoggedIn}
          onMarkersChange={handleMarkersChange}
          mapRef={mapRef}
          removeMarkerTrigger={deleteId}
        />
      </div>
    </div>
  );
}
