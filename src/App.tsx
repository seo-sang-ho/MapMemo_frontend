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
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* 지도 */}
      <MapView onMarkersChange={setMarkers} mapRef={mapRef} removeMarkerTrigger={deleteId} />

      {/* 마커 목록 */}
      <MarkerListPanel markers={markers} onMarkerClick={handleMarkerClick} onDeleteMarker={handleDeleteMarker}/>
    </div>
  );
}


export default App;