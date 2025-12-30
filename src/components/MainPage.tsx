import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Mapview from "./Mapview";
import type { Markerdata } from "./MarkerListPanel";
import api from "../api/axiosInstance";
import NavBar from "../components/NavBar";

export default function MainPage() {
  const [markers, setMarkers] = useState<Markerdata[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // 🔑 로그인 상태: null = 아직 확인 중
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // 검색 상태
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");

  const mapRef = useRef<naver.maps.Map | null>(null);
  const navigate = useNavigate();

  /**
   * ✅ 앱 시작 시 로그인 상태 확인
   * - refresh 성공 → 로그인
   * - 실패 → 비로그인
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        // 서버가 { accessToken } 내려주는 구조
        localStorage.setItem("accessToken", res.data.accessToken);
        setIsLoggedIn(true);
      } catch (e) {
        localStorage.removeItem("accessToken");
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * ✅ 로그인 상태일 때만 내 메모 조회
   */
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
    else if (isLoggedIn === false) setMarkers([]);
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

  const handleUpdateMarker = async (updated: Markerdata) => {
    try {
      await api.put(`/api/memos/${updated.id}`, {
        title: updated.title,
        content: updated.content,
        category: updated.category,
      });

      setMarkers(prev =>
        prev.map(m => (m.id === updated.id ? { ...m, ...updated } : m))
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
    try {
      await api.post("/api/auth/logout");
    } catch (e) {
      // 서버 오류여도 프론트 상태는 로그아웃 처리
    }

    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setMarkers([]);
    navigate("/");
  };

  const handleMarkersChange = useCallback((newMarkers: Markerdata[]) => {
    setMarkers(newMarkers);
  }, []);

  /**
   * 🚨 로그인 상태 확인 중에는 아무것도 렌더링 안 함
   * → 로그아웃 버튼 깜빡임 방지
   */
  if (isLoggedIn === null) {
    return null; // 또는 로딩 컴포넌트
  }

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
