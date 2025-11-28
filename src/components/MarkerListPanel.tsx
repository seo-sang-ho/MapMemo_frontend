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
    <div style={{ position: "relative" }}>
      {/* 버튼 */}
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          padding: "6px 12px",
          backgroundColor: "#e67e22",
          border: "none",
          borderRadius: "4px",
          color: "white",
          cursor: "pointer"
        }}
      >
        마커 목록 ☰
      </button>

      {/* 드롭다운 패널 */}
      {open && (
        <div style={{
          position: "absolute",
          top: "50px", // 버튼 바로 아래
          right: 0,
          width: "250px",
          maxHeight: "60vh",
          overflowY: "auto",
          background: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          padding: "10px",
          color: "black",
          zIndex: 1000
        }}>
          <h4 style={{ textAlign: "center", marginBottom: "8px" }}>📍 마커 목록</h4>
          {markers.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>표시된 마커가 없습니다.</p>
          ) : (
            markers.map((m) => (
              <div key={m.id} style={{
                borderBottom: "1px solid #eee",
                padding: "6px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div onClick={() => onMarkerClick?.(m.lat, m.lng)} style={{ cursor: "pointer" }}>
                  <b>{m.title}</b><br />
                  <small>{m.content}</small><br />
                  <small>{m.category}</small>
                </div>
                <button onClick={() => onDeleteMarker?.(m.id)} style={{
                  color: "white",
                  backgroundColor: "red",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}>삭제</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MarkerListPanel;
