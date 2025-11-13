import { useState } from "react";
import MapView  from "./components/Mapview"
import MarkerListPanel from "./components/MarkerListPanel";

interface Marker{
  title: string;
  content: string;
  lat: number;
  lng: number;
}

function App() {
  const [markers, setMarkers] = useState<Marker []>([]);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* 지도 */}
      <MapView onMarkersChange={setMarkers} />

      {/* 마커 목록 */}
      <MarkerListPanel markers={markers} />
    </div>
  );
}


export default App;