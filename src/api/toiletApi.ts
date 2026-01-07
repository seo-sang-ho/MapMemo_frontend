import axios from "./axiosInstance";
import type { PublicToilet } from "../types/PublicToilet";

export const fetchToiletsInBounds = async (
  minLat: number,
  maxLat: number,
  minLng: number,
  maxLng: number
): Promise<PublicToilet[]> => {
  const res = await axios.get("/api/toilets/in-bounds", {
    params: {
      minLat,
      maxLat,
      minLng,
      maxLng,
    },
  });

  return res.data;
};
