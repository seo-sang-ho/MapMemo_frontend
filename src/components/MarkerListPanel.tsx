import { useState } from "react";

interface MarkerListPanelProps {
  markers: MarkerData[];
  onMarkerClick?: (lat: number, lng: number) => void;
}

function MarkerListPanel({ markers, onMarkerClick }: MarkerListPanelProps) {
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
          }}
        >
          <h4 style={{ textAlign: "center",color:"black" ,marginBottom: "8px" }}>📍 현재 마커 목록</h4>
          {markers.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>표시된 마커가 없습니다.</p>
          ) : (
            markers.map((m, idx) => (
              <div 
                    key={idx} 
                    style={{ borderBottom: "1px solid #eee", padding: "6px 0", cursor: "pointer" }}
                    onClick={() => onMarkerClick && onMarkerClick(m.lat, m.lng)}
                    >
                <b>
                    <div style={{color:"black"}}>{m.title}</div>
                    </b>
                
                <small style={{ color: "black" }}>{m.content}</small>
                <br/>
                <small style={{color: "black"}}>{m.category}</small>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

export default MarkerListPanel;
