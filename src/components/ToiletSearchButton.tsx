interface Props {
  onSearch: () => void;
}

const ToiletSearchButton = ({ onSearch }: Props) => {
  return (
    <button
      onClick={onSearch}
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
        background: "white",
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        cursor: "pointer",
      }}
    >
      이 지도 영역 화장실 찾기
    </button>
  );
};

export default ToiletSearchButton;
