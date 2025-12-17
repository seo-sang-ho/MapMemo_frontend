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

  // 검색 상태
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");

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
      } catch (e) {
        console.error("내 메모 불러오기 실패", e);
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
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    await api.delete(`/api/memos/${id}`);
    setMarkers(prev => prev.filter(m => m.id !== id));
    setDeleteId(id);
  };

  // 메모 수정
  const handleUpdateMarker = async (updated: Markerdata) => {
    try {
      await api.put(`/api/memos/${updated.id}`, {
        title: updated.title,
        content: updated.content,
        category: updated.category,
      });

      setMarkers(prev =>
        prev.map(m =>
          m.id === updated.id ? { ...m, ...updated } : m
        )
      );
    } catch (e) {
      alert("메모 수정 실패");
      console.error(e);
    }
  };

  const handleSearch = async () => {
    const res = await api.get("/api/memos/search", {
      params: {
        keyword,
        category: category || undefined,
      },
    });

    setMarkers(res.data);
  };


  const handleLogout = async () => {
    await api.post("/api/auth/logout");
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setMarkers([]);
    navigate("/");
  };

  const handleMarkersChange = useCallback((newMarkers: Markerdata[]) => {
    setMarkers(newMarkers);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col">
      <NavBar
        isLoggedIn={isLoggedIn}
        markers={markers}
        keyword={keyword}
        category={category}
        onKeywordChange={setKeyword}
        onCategoryChange={setCategory}
        onSearch={handleSearch}
        onLogout={handleLogout}
        onMarkerClick={handleMarkerClick}
        onDeleteMarker={handleDeleteMarker}
        onUpdateMarker={handleUpdateMarker}
      />

      <div className="flex-1 relative">
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
