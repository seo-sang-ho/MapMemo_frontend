import { useState } from "react";
import MemoEditModal from "./MemoEditModal";

export interface Markerdata {
  id: number;
  title: string;
  content: string;
  category: string;
  latitude: number;
  longitude: number;
}

interface Props {
  markers: Markerdata[];
  keyword: string;
  category: string;
  onKeywordChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onSearch: () => void;
  onMarkerClick?: (lat: number, lng: number) => void;
  onDeleteMarker?: (id: number) => void;
  onUpdateMarker?: (memo: Markerdata) => void;
}

export default function MarkerListPanel({
  markers,
  keyword,
  category,
  onKeywordChange,
  onCategoryChange,
  onSearch,
  onMarkerClick,
  onDeleteMarker,
  onUpdateMarker,
}: Props) {
  const [open, setOpen] = useState(false);
  const [editMemo, setEditMemo] = useState<Markerdata | null>(null);

  return (
    <div className="relative">
      {/* 버튼 */}
      <button
        onClick={() => setOpen(p => !p)}
        className="h-9 px-4 rounded-md bg-orange-500 text-white
                   hover:bg-orange-600 flex items-center justify-center"
      >
        마커 목록
      </button>

      {/* 드롭다운 */}
      {open && (
        <div
          className="absolute right-0 top-12 w-64
                     bg-white text-black
                     rounded-xl shadow p-3 z-50"
        >
          <h4 className="text-center font-semibold mb-3">
            📍 마커 목록
          </h4>

    {/* 🔍 검색 영역 */}
    <div className="flex flex-col gap-2 mb-3">
      <input
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="검색어"
        className="w-full px-2 py-1 border rounded text-sm"
      />

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full px-2 py-1 border rounded text-sm"
      >
        <option value="">전체 카테고리</option>
        <option value="TOILET">화장실</option>
        <option value="STORE">상점</option>
        <option value="ETC">기타</option>
      </select>

      <button
        onClick={onSearch}
        className="w-full py-1 bg-black text-white rounded text-sm"
      >
        검색
      </button>
    </div>


          {/* 마커 목록 */}
          {markers.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">
              표시된 마커가 없습니다.
            </p>
          ) : (
            markers.map(m => (
              <div
                key={m.id}
                className="border-b last:border-b-0 pb-2 mb-2
                           flex justify-between gap-2"
              >
                <div
                  className="cursor-pointer flex-1"
                  onClick={() => onMarkerClick?.(m.latitude, m.longitude)}
                >
                  <p className="font-semibold text-sm truncate">
                    {m.title}
                  </p>
                  <p className="text-xs text-gray-700 truncate">
                    {m.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    {m.category}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setEditMemo(m)}
                    className="text-xs px-2 py-1 rounded
                               bg-gray-700 text-white"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDeleteMarker?.(m.id)}
                    className="text-xs px-2 py-1 rounded
                               bg-red-500 text-white"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 수정 모달 */}
      {editMemo && (
        <MemoEditModal
          memo={editMemo}
          onClose={() => setEditMemo(null)}
          onUpdated={(updated) => {
            onUpdateMarker?.(updated);
            setEditMemo(null);
          }}
        />
      )}
    </div>
  );
}
