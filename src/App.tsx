import { useRef, useState } from "react";
import MapView, { type Markerdata }  from "./components/Mapview"
import MarkerListPanel from "./components/MarkerListPanel";

interface Marker{
  title: string;
  content: string;
  category: string;
  lat: number;
  lng: number;
}

function App() {
  const [markers, setMarkers] = useState<Markerdata[]>([]);
  const mapRef = useRef<naver.maps.Map | null > (null);

  // 마커 클릭 시 지도 이동
  const handleMarkerClick = (lat: number, lng: number) => {
    if (mapRef.current) {
      const center = new window.naver.maps.LatLng(lat, lng);
      mapRef.current.setCenter(center);
      mapRef.current.setZoom(17); // 원하는 확대 레벨
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* 지도 */}
      <MapView onMarkersChange={setMarkers} mapRef={mapRef} />

      {/* 마커 목록 */}
      <MarkerListPanel markers={markers} onMarkerClick={handleMarkerClick}/>
    </div>
  );
}


export default App;