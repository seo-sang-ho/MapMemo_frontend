export const CATEGORY_OPTIONS = [
  { value: "FOOD", label: "음식점", color: "bg-red-100 text-red-700" },
  { value: "CAFE", label: "카페", color: "bg-blue-100 text-blue-700" },
  { value: "WORK", label: "회사", color: "bg-green-100 text-green-700" },
  { value: "TRAVEL", label: "여행", color: "bg-purple-100 text-purple-700" },
  { value: "TOILET", label: "화장실", color: "bg-yellow-100 text-yellow-700" },


] as const;

export type CategoryType = typeof CATEGORY_OPTIONS[number]["value"];
