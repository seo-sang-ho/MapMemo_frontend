import { useState } from "react";

export interface Markerdata {
  id: number;
  title: string;
  content: string;
  category: string;
  latitude: number;
  longitude: number;
}

interface MarkerListPanelProps {
  markers: Markerdata[];
  onMarkerClick?: (lat: number, lng: number) => void;
  onDeleteMarker?: (id: number) => void;
}

function MarkerListPanel({
  markers,
  onMarkerClick,
  onDeleteMarker,
}: MarkerListPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="h-9 px-4 rounded-md bg-orange-500 text-white
                   hover:bg-orange-600 transition whitespace-nowrap"
      >
        마커 목록
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-12 w-64 max-h-[60vh] overflow-y-auto
                     bg-white rounded-xl shadow-lg p-3 text-black z-[1000]"
        >
          <h4 className="text-center font-semibold mb-3">
            📍 마커 목록
          </h4>

          {markers.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">
              표시된 마커가 없습니다.
            </p>
          ) : (
            <ul className="space-y-2">
              {markers.map((m) => (
                <li
                  key={m.id}
                  className="flex justify-between items-start gap-2
                             border-b last:border-b-0 pb-2"
                >
                  <div
                    className="cursor-pointer flex-1"
                    onClick={() => onMarkerClick?.(m.latitude, m.longitude)}
                  >
                    <p className="font-semibold text-sm truncate">
                      {m.title}
                    </p>
                    <p className="text-xs text-gray-600 truncate">
                      {m.content}
                    </p>
                    <p className="text-xs text-gray-400">
                      {m.category}
                    </p>
                  </div>

                  <button
                    onClick={() => onDeleteMarker?.(m.id)}
                    className="text-xs px-2 py-1 rounded-md bg-red-500 text-white
                               hover:bg-red-600 transition whitespace-nowrap"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default MarkerListPanel;
