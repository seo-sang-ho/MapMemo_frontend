import axios from "axios";4
import { useEffect, useRef } from "react";

function App() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<naver.maps.Map | null>(null);

  useEffect(() => {
    if (!window.naver) {
      console.error("네이버 지도 스크립트가 로드되지 않았습니다.");
      return;
    }

    // 기본 지도 옵션
    const mapOptions: naver.maps.MapOptions = {
      center: new naver.maps.LatLng(37.5665, 126.9780), // 서울시청
      zoom: 14,
      zoomControl: true,
      zoomControlOptions:{
        style: naver.maps.ZoomControlStyle.SMALL,
        position: naver.maps.Position.TOP_RIGHT
      }
    };

    mapInstance.current = new naver.maps.Map(mapRef.current!, mapOptions);

    // 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const userPos = new naver.maps.LatLng(latitude, longitude);

          new naver.maps.Marker({
            position: userPos,
            map: mapInstance.current!,
          });

          mapInstance.current!.setCenter(userPos);
        },
        (err) => {
          console.warn("현재 위치를 불러올 수 없습니다:", err);
        }
      );
    }

    // 서버에서 저장된 메모 불러오기
    axios.get("http://localhost:8080/api/memos").then((res) => {
      res.data.forEach((memo: any) => {
        const pos = new naver.maps.LatLng(memo.latitude, memo.longitude);
        addMemoMarker(pos, memo.title, memo.content);
      });
    });

    // 지도 클릭 이벤트 → 메모 생성
    naver.maps.Event.addListener(mapInstance.current!, "click", async (e: any) => {
      const latlng = e.coord;

      const title = prompt("메모 제목을 입력하세요:");
      if (!title) return;

      const content = prompt("메모 내용을 입력하세요:");
      if (!content) return;

      const newMemo = {
        title,
        content,
        latitude: latlng.lat(),
        longitude: latlng.lng(),
      };

      await axios.post("http://localhost:8080/api/memos", newMemo);
      addMemoMarker(latlng, title, content);
    });

    // 메모 마커 + 정보창 표시 함수
    function addMemoMarker(position: naver.maps.LatLng, title: string, content: string) {
      const marker = new naver.maps.Marker({
        position,
        map: mapInstance.current!,
      });

      const infoWindow = new naver.maps.InfoWindow({
        content: `<div style="padding:8px; min-width:150px; color:black;">
                    <b>${title}</b><br/>${content}
                  </div>`,
      });

      naver.maps.Event.addListener(marker, "click", () => {
        infoWindow.open(mapInstance.current!, marker);
      });
    }
  }, []);

  // 지도 확대/축소 함수
  const zoomIn = () => {
    if (mapInstance.current) {
      const zoom = mapInstance.current.getZoom();
      mapInstance.current.setZoom(zoom + 1);
    }
  };

  const zoomOut = () => {
    if (mapInstance.current) {
      const zoom = mapInstance.current.getZoom();
      mapInstance.current.setZoom(zoom - 1);
    }
  };

  return (
    <>
      <div
        ref={mapRef}
        style={{ width: "100%", height: "100vh" }}
      ></div>
    </>
  );
}

export default App;
