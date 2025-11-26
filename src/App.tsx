import { useRef, useState } from "react";
import MapView, { type Markerdata }  from "./components/Mapview"
import MarkerListPanel from "./components/MarkerListPanel";
import axios from "axios";

function App() {
  const [markers, setMarkers] = useState<Markerdata[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const mapRef = useRef<naver.maps.Map | null > (null);

  // 마커 클릭 시 지도 이동
  const handleMarkerClick = (lat: number, lng: number) => {
    if (mapRef.current) {
      const center = new window.naver.maps.LatLng(lat, lng);
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(17); // 원하는 확대 레벨
    }
  };

  // 마커 삭제 처리
  const handleDeleteMarker = async (id: number) => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if(!ok) return;

    try {
      await axios.delete(`http://localhost:8080/api/memos/${id}`);

      setMarkers(prev => prev.filter(m => m.id !== id));

      setDeleteId(id); // MapView에서 삭제 트리거
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* 상단 네비게이션 바 */}
      <nav style={{
        height: "60px",
        backgroundColor: "#000000ff",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "relative",
        zIndex: 1000,
        flexShrink: 0,
      }}>
        {/* 로고 */}
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>
          MapMemo
        </div>

        {/* 오른쪽 메뉴 */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button style={{
            padding: "10px 16px",
            backgroundColor: "#3498db",
            border: "none",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer"
          }}>로그인</button>

          <button style={{
            padding: "8px 16px",
            backgroundColor: "#1abc9c",
            border: "none",
            borderRadius: "4px",
            color: "white",
            cursor: "pointer"
          }}>회원가입</button>

          {/* 마커 목록 패널 통합 */}
          <MarkerListPanel
            markers={markers}
            onMarkerClick={handleMarkerClick}
            onDeleteMarker={handleDeleteMarker}
          />
        </div>
      </nav>

      {/* 지도 영역 */}
      <div style={{ flex: 1, position: "relative" }}>
        <MapView
          onMarkersChange={setMarkers}
          mapRef={mapRef}
          removeMarkerTrigger={deleteId}
        />
      </div>
    </div>
  );
}

export default App;