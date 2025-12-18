export const CATEGORY_OPTIONS = [
  { value: "TOILET", label: "화장실", color: "bg-blue-100 text-blue-700" },
  { value: "STORE", label: "상점", color: "bg-green-100 text-green-700" },
  { value: "ETC", label: "기타", color: "bg-gray-100 text-gray-700" },
] as const;

export type CategoryType = typeof CATEGORY_OPTIONS[number]["value"];
