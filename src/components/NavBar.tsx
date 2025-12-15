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
    <nav className="w-full h-[60px] bg-black text-white flex items-center justify-between px-5 z-[1000]">
      {/* Logo */}
      <div
        className="text-xl font-bold cursor-pointer whitespace-nowrap"
        onClick={() => navigate("/")}
      >
        MapMemo
      </div>

      {/* Right Area */}
      <div className="flex items-center gap-2 whitespace-nowrap">
        {!isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="h-9 min-w-[80px] px-4 rounded-md border border-white
                         hover:bg-white hover:text-black transition"
            >
              로그인
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="h-9 min-w-[80px] px-4 rounded-md bg-white text-black
                         hover:bg-gray-200 transition"
            >
              회원가입
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onLogout}
              className="h-9 min-w-[80px] px-4 rounded-md bg-white text-black
                         hover:bg-gray-200 transition"
            >
              로그아웃
            </button>

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
