import { useState } from "react";
import type { Markerdata } from "./MarkerListPanel";

interface Props {
  memo: Markerdata;
  onClose: () => void;
  onUpdated: (memo: Markerdata) => void;
}

export default function MemoEditModal({ memo, onClose, onUpdated }: Props) {
  const [title, setTitle] = useState(memo.title);
  const [content, setContent] = useState(memo.content);
  const [category, setCategory] = useState(memo.category);
  const [error, setError] = useState("");

  const handleUpdate = () => {
    if (!title || !content) {
      setError("제목과 내용은 필수입니다.");
      return;
    }

    onUpdated({
      ...memo,
      title,
      content,
      category,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow">
        <h2 className="font-bold mb-4">메모 수정</h2>

        <input
          className="w-full border p-2 mb-2"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="제목"
        />
        <textarea
          className="w-full border p-2 mb-2"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="내용"
        />
        <input
          className="w-full border p-2"
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder="카테고리"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}>취소</button>
          <button
            onClick={handleUpdate}
            className="bg-black text-white px-4 py-2 rounded"
          >
            수정
          </button>
        </div>
      </div>
    </div>
  );
}
