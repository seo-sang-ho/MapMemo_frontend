import { useEffect, useRef } from "react";
import axios from "../api/axiosInstance";
import type { Markerdata } from "./MarkerListPanel";

interface MapViewProps {
  onMarkersChange?: (markers: Markerdata[]) => void;
  mapRef?: React.RefObject<naver.maps.Map | null>;
  removeMarkerTrigger?: number | null;
}

export default function Mapview({ onMarkersChange, mapRef, removeMarkerTrigger }: MapViewProps) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const internalMapRef = useRef<naver.maps.Map | null>(null);
  const markerObjsRef = useRef<{data: Markerdata, marker: naver.maps.Marker, infoWindow: naver.maps.InfoWindow}[]>([]);

  useEffect(() => {
    if (!window.naver) return;

    // 지도 생성
    internalMapRef.current = new naver.maps.Map(divRef.current!, { 
      center: new naver.maps.LatLng(37.5665, 126.9780), 
      zoom: 16, 
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT
    }
    });

    if (mapRef) mapRef.current = internalMapRef.current;
    const map = internalMapRef.current;

    // 현재 위치 표시
    navigator.geolocation?.getCurrentPosition(pos => {
      const loc = new naver.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      new naver.maps.Marker({ position: loc, map });
      map.setCenter(loc);
    });

    // 서버에서 메모 불러오기
    axios.get("/api/memos/my").then(res => {
      res.data.forEach((memo: any) => addMemoMarker({...memo, lat: memo.latitude, lng: memo.longitude}));
    }).catch(err => console.error("메모 불러오기 실패", err));

    naver.maps.Event.addListener(map, "click", async (e: any) => {
      if (!localStorage.getItem("accessToken")) {
        alert("로그인이 필요합니다");
        return;
      }

      const latlng = e.coord;

      const title = prompt("메모 제목");
      if (!title) return;

      const content = prompt("메모 내용");
      if (!content) return;

      const category = prompt("종류");
      if (!category) return;

      const newMemo = {
        title,
        content,
        category,
        latitude: latlng.lat(),
        longitude: latlng.lng(),
      };

      try {
        const res = await axios.post("/api/memos", newMemo);
        addMemoMarker({
          ...newMemo,
          id: res.data.id,
          lat: latlng.lat(),
          lng: latlng.lng(),
        });
      } catch (err) {
        console.error("메모 생성 실패", err);
      }
    });


    // 메모 마커 + 정보창 표시 함수
    function addMemoMarker(markerData: Markerdata) {
      console.log(markerData);
      const marker = new naver.maps.Marker({ position: new naver.maps.LatLng(markerData.lat, markerData.lng), map });
      const infoWindow = new naver.maps.InfoWindow({
        content:  `
          <div style="
            padding: 8px; 
            min-width: 150px; 
            color: black; 
            background-color: #ffffff; 
            border-radius: 6px; 
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">
            <b>${markerData.title}</b><br/>
            ${markerData.content}<br/>
            <small style="color: gray;">[${markerData.category}]</small>
          </div>
        `
      });
      naver.maps.Event.addListener(marker, "click", () => infoWindow.open(map, marker));
      markerObjsRef.current.push({ data: markerData, marker, infoWindow });
      onMarkersChange?.(markerObjsRef.current.map(o => o.data));
    }

  }, [onMarkersChange, mapRef]);

  // 삭제 요청 처리
  useEffect(() => {
    if (!removeMarkerTrigger) return;
    const toRemove = markerObjsRef.current.find(obj => obj.data.id === removeMarkerTrigger);
    if (toRemove) {
      toRemove.marker.setMap(null);
      toRemove.infoWindow.close();
      markerObjsRef.current = markerObjsRef.current.filter(obj => obj.data.id !== removeMarkerTrigger);
      onMarkersChange?.(markerObjsRef.current.map(obj => obj.data));
    }
  }, [removeMarkerTrigger, onMarkersChange]);

  return <div ref={divRef} style={{ width: "100%", height: "100%" }} />;
}
