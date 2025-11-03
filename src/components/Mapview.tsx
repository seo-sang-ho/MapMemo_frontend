import { useEffect, useRef } from 'react';

function App() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const kakao = window.kakao;
    const container = mapRef.current; // 지도를 담을 영역의 DOM 참조

    // 지도를 생성할 때 필요한 기본 옵션
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표.
      level: 3, //
    };

    mapInstance.current = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position){

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const locPosition = new kakao.maps.LatLng(lat,lon),
      message = '<div style="padding:5px; color:black">현재 위치</div>';

      displayMarker(locPosition,message);

      });

      // geolocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용 설정
    } else{

      const locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
      message = 'geolacaiton을 사용할 수 없습니다.';

      displayMarker(locPosition,message);
    }

    // 지도에 마커와 인포윈도우 표시하는 함수
    function displayMarker(locPosition,message){

      const marker = new kakao.maps.Marker({
        map: mapInstance.current,
        position: locPosition
      });

      // 인포윈도우에 표시할 내용
      const iwContent = message, 
            iwRemoveable = true;

      // 인포윈도우 생성
      const infowindow = new kakao.maps.InfoWindow({
        content: iwContent,
        removable: iwRemoveable
      });

      infowindow.open(mapInstance.current,marker);

      mapInstance.current.setCenter(locPosition);
    };

  }, []);



  // 지도 사용자 컨트롤 버튼 생성 함수
  function setMapType(type) {
      if (!mapInstance.current) return;
      
      if (type === 'roadmap') {
        mapInstance.current.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
      } else {
        mapInstance.current.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
      }
    }

    function zoomIn() {
      if (!mapInstance.current) return;
      mapInstance.current.setLevel(mapInstance.current.getLevel() - 1);
    }

    function zoomOut() {
      if (!mapInstance.current) return;
      mapInstance.current.setLevel(mapInstance.current.getLevel() + 1);
    }

  return (
    <>
      <div ref={mapRef} style={{ width: '100%', height: '100vh' }}></div>
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={() => setMapType('roadmap')}>로드맵</button>
        <button onClick={() => setMapType('skyview')}>스카이뷰</button>
        <button onClick={zoomIn}>확대</button>
        <button onClick={zoomOut}>축소</button>
      </div>
    </>
  );
}

export default App;