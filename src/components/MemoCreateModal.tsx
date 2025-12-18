import { useState } from "react";
import api from "../api/axiosInstance";
import CategorySelect from "./CategorySelect";
import type { Markerdata } from "./MarkerListPanel";

interface Props {
  latitude: number;
  longitude: number;
  onClose: () => void;
  onCreated: (memo: Markerdata) => void;
}

export default function MemoCreateModal({
  latitude,
  longitude,
  onClose,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("ETC");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title || !content) {
      setError("제목과 내용은 필수입니다.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/api/memos", {
        title,
        content,
        category,
        latitude,
        longitude,
      });

      onCreated(res.data);
      onClose();
    } catch {
      setError("메모 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow p-6">
        <h2 className="text-lg font-bold mb-4">메모 등록</h2>

        <div className="flex flex-col gap-3">
          <input
            className="border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
          />

          <textarea
            className="border rounded px-3 py-2 resize-none"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용"
          />

          {/* ✅ 카테고리 버튼 선택 */}
          <CategorySelect value={category} onChange={setCategory} />

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            취소
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}
