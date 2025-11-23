import { useState } from "react";

export interface Markerdata{
  id: number;
  title: string;
  content: string;
  category: string;
  lat: number;
  lng: number;

}

interface MarkerListPanelProps {
  markers: Markerdata[];
  onMarkerClick?: (lat: number, lng: number) => void;
  onDeleteMarker?: (id: number) => void;
}

function MarkerListPanel({ markers, onMarkerClick, onDeleteMarker }: MarkerListPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 햄버거 버튼 */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => setOpen((prev) => !prev)}
          style={{
            width: "40px",
            height: "40px",
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </div>

      {/* 패널 */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: 70,
            right: 20,
            width: "250px",
            maxHeight: "70vh",
            overflowY: "auto",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            padding: "10px",
            zIndex: 20,
            color: "black"
          }}
        >
          <h4 style={{ textAlign: "center",color:"black" ,marginBottom: "8px" }}>📍 현재 마커 목록</h4>
          {markers.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>표시된 마커가 없습니다.</p>
          ) : (
            markers.map((m) => (
              <div key={m.id} style={{ borderBottom: "1px solid #eee", padding: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div onClick={() => onMarkerClick?.(m.lat, m.lng)} style={{ cursor: "pointer" }}>
                  <b>{m.title}</b>
                  <br />
                  <small>{m.content}</small>
                  <br />
                  <small>{m.category}</small>
                </div>
                <button onClick={() => onDeleteMarker?.(m.id)} style={{ color: "black", backgroundColor: "red", border: "none", borderRadius: 4, cursor: "pointer" }}>
                  삭제
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

export default MarkerListPanel;
