import type { Markerdata } from "../components/MarkerListPanel";

interface Props {
  memo: Markerdata;
}

export default function InfoWindowContent({ memo }: Props) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "8px",
        minWidth: "160px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
        color: "#000",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
        {memo.title}
      </div>

      <div style={{ fontSize: "13px", marginBottom: "6px" }}>
        {memo.content}
      </div>

      <div style={{ fontSize: "11px", color: "#666" }}>
        [{memo.category}]
      </div>
    </div>
  );
}
