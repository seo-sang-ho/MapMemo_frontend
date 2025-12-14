// src/components/NavBar.tsx
import { useNavigate } from "react-router-dom";
import MarkerListPanel from "../components/MarkerListPanel";
import type { Markerdata } from "../components/MarkerListPanel";

interface NavBarProps {
  isLoggedIn: boolean;
  markers: Markerdata[];
  onLogout: () => void;
  onMarkerClick: (lat: number, lng: number) => void;
  onDeleteMarker: (id: number) => void;
}

export default function NavBar({
  isLoggedIn,
  markers,
  onLogout,
  onMarkerClick,
  onDeleteMarker,
}: NavBarProps) {
  const navigate = useNavigate();

  return (
    <nav
      style={{
        height: "60px",
        backgroundColor: "#000",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        position: "relative",
        zIndex: 1000,
      }}
    >
      <div style={{ fontSize: "24px", fontWeight: "bold" }}>MapMemo</div>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {!isLoggedIn ? (
          <>
            <button onClick={() => navigate("/login")}>로그인</button>
            <button onClick={() => navigate("/signup")}>회원가입</button>
          </>
        ) : (
          <>
            <button onClick={onLogout}>로그아웃</button>
            <MarkerListPanel
              markers={markers}
              onMarkerClick={onMarkerClick}
              onDeleteMarker={onDeleteMarker}
            />
          </>
        )}
      </div>
    </nav>
  );
}
