import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import axios from "../api/axiosInstance";
import type { Markerdata } from "./MarkerListPanel";
import MemoCreateModal from "../components/MemoCreateModal";
import InfoWindowContent from "../components/InfoWindowContent";
import { MARKER_ICON_BY_CATEGORY } from "../constants/markerIcons";

interface MapViewProps {
  onMarkersChange?: (markers: Markerdata[]) => void;
  mapRef?: React.RefObject<naver.maps.Map | null>;
  removeMarkerTrigger?: number | null;
  isLoggedIn: boolean;
}

export default function Mapview({
  onMarkersChange,
  mapRef,
  removeMarkerTrigger,
  isLoggedIn,
}: MapViewProps) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const internalMapRef = useRef<naver.maps.Map | null>(null);

  const markerObjsRef = useRef<
    {
      data: Markerdata;
      marker: naver.maps.Marker;
      infoWindow: naver.maps.InfoWindow;
    }[]
  >([]);

  const [createPos, setCreatePos] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (!window.naver || !divRef.current) return;

    // ================= 지도 생성 =================
    const map = new naver.maps.Map(divRef.current, {
      center: new naver.maps.LatLng(37.5665, 126.978),
      zoom: 16,
      zoomControl: true,
      zoomControlOptions: {
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT,
      },
    });

    internalMapRef.current = map;
    if (mapRef) mapRef.current = map;

    // ================= 신버전 규칙: init 이후 =================
    naver.maps.Event.once(map, "init", () => {
      // 현재 위치 초기 표시
      navigator.geolocation?.getCurrentPosition(pos => {
        const loc = new naver.maps.LatLng(
          pos.coords.latitude,
          pos.coords.longitude
        );
        new naver.maps.Marker({ position: loc, map });
        map.setCenter(loc);
      });

      // 내 위치 버튼 (CustomControl)
      const locationBtnHtml = `
        <button
          style="
            background: white;
            border: none;
            padding: 8px 10px;
            border-radius: 6px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            cursor: pointer;
            font-size: 13px;
            color: black;
          "
        >
          📍 내 위치
        </button>
      `;

      const locationControl = new naver.maps.CustomControl(
        locationBtnHtml,
        { position: naver.maps.Position.RIGHT_BOTTOM }
      );

      locationControl.setMap(map);

      naver.maps.Event.addDOMListener(
        locationControl.getElement(),
        "click",
        () => {
          navigator.geolocation.getCurrentPosition(
            pos => {
              const latlng = new naver.maps.LatLng(
                pos.coords.latitude,
                pos.coords.longitude
              );
              map.setCenter(latlng);
              map.setZoom(16);
            },
            () => alert("현재 위치를 가져올 수 없습니다.")
          );
        }
      );

      // 서버 메모 로딩
      axios.get("/api/memos/my").then(res => {
        res.data.forEach((memo: Markerdata) => addMemoMarker(memo));
      });

      // 지도 클릭 → 메모 생성
      naver.maps.Event.addListener(map, "click", (e: any) => {
        if (!localStorage.getItem("accessToken")) {
          alert("로그인이 필요합니다");
          return;
        }

        setCreatePos({
          lat: e.coord.lat(),
          lng: e.coord.lng(),
        });
      });
    });

    // ================= 마커 생성 함수 =================
    function addMemoMarker(markerData: Markerdata) {
      const iconUrl =
        MARKER_ICON_BY_CATEGORY[markerData.category] ??
        MARKER_ICON_BY_CATEGORY.DEFAULT;

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(
          markerData.latitude,
          markerData.longitude
        ),
        map,
        icon: {
          url: iconUrl,
          size: new naver.maps.Size(32, 32),
          scaledSize: new naver.maps.Size(32, 32),
          origin: new naver.maps.Point(0, 0),
          anchor: new naver.maps.Point(16, 32),
        },
      });

      const container = document.createElement("div");
      const root = createRoot(container);
      root.render(<InfoWindowContent memo={markerData} />);

      const infoWindow = new naver.maps.InfoWindow({
        content: container,
      });

      naver.maps.Event.addListener(marker, "click", () => {
        infoWindow.open(map, marker);
      });

      markerObjsRef.current.push({
        data: markerData,
        marker,
        infoWindow,
      });

      onMarkersChange?.(
        markerObjsRef.current.map(o => o.data)
      );
    }

    (window as any).addMemoMarker = addMemoMarker;
  }, [mapRef, onMarkersChange]);

  // ================= 마커 삭제 =================
  useEffect(() => {
    if (!removeMarkerTrigger) return;

    const target = markerObjsRef.current.find(
      o => o.data.id === removeMarkerTrigger
    );

    if (target) {
      target.marker.setMap(null);
      target.infoWindow.close();

      markerObjsRef.current = markerObjsRef.current.filter(
        o => o.data.id !== removeMarkerTrigger
      );

      onMarkersChange?.(
        markerObjsRef.current.map(o => o.data)
      );
    }
  }, [removeMarkerTrigger, onMarkersChange]);

  // ================= 로그아웃 처리 =================
  useEffect(() => {
    if (!isLoggedIn) {
      markerObjsRef.current.forEach(o => {
        o.marker.setMap(null);
        o.infoWindow.close();
      });
      markerObjsRef.current = [];
    }
  }, [isLoggedIn]);

  return (
    <>
      <div ref={divRef} style={{ width: "100%", height: "100%" }} />

      {createPos && (
        <MemoCreateModal
          latitude={createPos.lat}
          longitude={createPos.lng}
          onClose={() => setCreatePos(null)}
          onCreated={(memo) => {
            (window as any).addMemoMarker(memo);
          }}
        />
      )}
    </>
  );
}
