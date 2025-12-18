import { CATEGORY_OPTIONS } from "../constants/category";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function CategorySelect({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORY_OPTIONS.map(c => (
        <button
          key={c.value}
          type="button"
          onClick={() => onChange(c.value)}
          className={`
            px-3 py-1 rounded-full text-sm border
            ${value === c.value
              ? `${c.color} border-transparent`
              : "bg-white text-gray-500 border-gray-300"}
          `}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
