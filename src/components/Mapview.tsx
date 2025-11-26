import axios from "axios";4
import { useEffect, useRef } from "react";

export interface Markerdata{
  id: number;
  title: string;
  content: string;
  category: string;
  lat: number;
  lng: number;
}

interface MapViewProps {
  onMarkersChange?: (markers: any[]) => void; // 상위 컴포넌트(App)에 마커 정보 전달
  mapRef?: React.RefObject<naver.maps.Map | null>;
  removeMarkerTrigger?: number | null; // 삭제
}

function MapView({ onMarkersChange, mapRef, removeMarkerTrigger }: MapViewProps) {
  const divRef = useRef<HTMLDivElement | null>(null); // 지도 div용
  const internalMapRef = useRef<naver.maps.Map | null>(null);
  const markerObjsRef = useRef<{ data: Markerdata; marker: naver.maps.Marker; infoWindow: naver.maps.InfoWindow}[]>([])

  useEffect(() => {
    if (!window.naver) {
      console.error("네이버 지도 스크립트가 로드되지 않았습니다.");
      return;
    }

    // 기본 지도 옵션
    const mapOptions: naver.maps.MapOptions = {
      center: new naver.maps.LatLng(37.5665, 126.9780), // 서울시청
      zoom: 16,
      zoomControl: true,
      zoomControlOptions:{
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT
      }
    };

    // 지도 객체 생성
    internalMapRef.current = new naver.maps.Map(divRef.current!, mapOptions);
    if (mapRef) mapRef.current = internalMapRef.current;

    const map = internalMapRef.current;

    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = new naver.maps.LatLng(position.coords.latitude, position.coords.longitude);
          new naver.maps.Marker({ position: userPos, map});
          map.setCenter(userPos);
        },
        (err) => console.warn("현재 위치를 불러올 수 없습니다:", err)
      );
    }

    // 서버에서 저장된 메모 불러오기
    axios.get("http://localhost:8080/api/memos").then((res) => {
      res.data.forEach((memo: any) => {
        addMemoMarker({...memo, lat: memo.latitude, lng: memo.longitude });
      });
    });

    // 지도 클릭 이벤트 → 메모 생성
    naver.maps.Event.addListener(map, "click", async (e: any) => {
      const latlng = e.coord;

      const title = prompt("메모 제목을 입력하세요:");
      if (!title) return;

      const content = prompt("메모 내용을 입력하세요:");
      if (!content) return;

      const category = prompt("종류를 입력하세요: 'TOILET', 'STORE', 'ETC'");
      if (!category) return;

      const newMemo = {
        title,
        content,
        category,
        latitude: latlng.lat(),
        longitude: latlng.lng(),
      };

      const res = await axios.post("http://localhost:8080/api/memos", newMemo);
      addMemoMarker({ ...newMemo, id: res.data.id, lat: latlng.lat(), lng: latlng.lng() });
    });

    // 메모 마커 + 정보창 표시 함수
    function addMemoMarker(markerData : Markerdata) {
      const marker = new naver.maps.Marker({ position: new naver.maps.LatLng(markerData.lat, markerData.lng), map });

      const infoWindow = new naver.maps.InfoWindow({
        content: `<div style="padding:8px; min-width:150px; color:black;">
                    <b>${markerData.title}</b><br/>${markerData.content}<br/>
                    <small style="color: gray;">[${markerData.category}]</small>
                  </div>`,
      });

      // 마커 클릭 시 정보 표시
      naver.maps.Event.addListener(marker, "click", () => infoWindow.open(map, marker)); 
      markerObjsRef.current.push({ data: markerData, marker, infoWindow });

      if (onMarkersChange) onMarkersChange(markerObjsRef.current.map((obj) => obj.data));
    }
  }, [onMarkersChange, mapRef]);

    // 삭제 요청 반영
      useEffect(() => {
        if (!removeMarkerTrigger) return;

        const toRemove = markerObjsRef.current.find((obj) => obj.data.id === removeMarkerTrigger);
        if (toRemove) {
          toRemove.marker.setMap(null); // 지도에서 제거
          toRemove.infoWindow.close(); // 정보창 닫기
          markerObjsRef.current = markerObjsRef.current.filter((obj) => obj.data.id !== removeMarkerTrigger);
          if (onMarkersChange) onMarkersChange(markerObjsRef.current.map((obj) => obj.data));
        }
      }, [removeMarkerTrigger, onMarkersChange]);

  return (
    <>
      <div ref={divRef} style={{ width: "100%", height: "100%" }}> </div>
    </>
  );
}

export default MapView;
