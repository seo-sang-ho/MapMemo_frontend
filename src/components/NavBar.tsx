import { useNavigate } from "react-router-dom";
import MarkerListPanel from "./MarkerListPanel";
import type { Markerdata } from "./MarkerListPanel";

interface Props {
  isLoggedIn: boolean;
  markers: Markerdata[];
  onLogout: () => void;
  onMarkerClick: (lat: number, lng: number) => void;
  onDeleteMarker: (id: number) => void;
  onUpdateMarker: (memo: Markerdata) => void;
}

export default function NavBar({
  isLoggedIn,
  markers,
  onLogout,
  onMarkerClick,
  onDeleteMarker,
  onUpdateMarker,
}: Props) {
  const navigate = useNavigate();

  return (
    <nav className="h-[60px] bg-black text-white flex justify-between items-center px-5">
      <div className="font-bold cursor-pointer" onClick={() => navigate("/")}>
        MapMemo
      </div>

      {!isLoggedIn ? (
        <div className="flex gap-2">
          <button onClick={() => navigate("/login")}>로그인</button>
          <button onClick={() => navigate("/signup")}>회원가입</button>
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <button onClick={onLogout}>로그아웃</button>
          <MarkerListPanel
            markers={markers}
            onMarkerClick={onMarkerClick}
            onDeleteMarker={onDeleteMarker}
            onUpdateMarker={onUpdateMarker}
          />
        </div>
      )}
    </nav>
  );
}
