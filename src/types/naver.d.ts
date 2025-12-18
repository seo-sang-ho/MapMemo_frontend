interface Window {
  naver: any;
}

declare namespace naver.maps {
  // 지도 클래스
  class Map {
    constructor(el: HTMLElement, options: MapOptions);
    setCenter(latlng: LatLng): void;
    setZoom(zoom: number): void;
  }

  // 지도 옵션
  interface MapOptions {
    center: LatLng;
    zoom?: number;
    minZoom?: number;
    zoomControl?: boolean;
    zoomControlOptions?: {
      style?: any;
      position?: any;
    };
    mapTypeControl?: boolean;
    mapDataControl?: boolean;
  }

  // 좌표
  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  // 마커
  class Marker {
    constructor(options: { position: LatLng; map?: Map });
    setMap(map: Map | null): void;
  }

  // 정보창
  class InfoWindow {
  constructor(options: { content: string | HTMLElement });
  open(map: Map, marker: Marker): void;
  close(): void;
  } 

  // 이벤트
  const Event: {
    addListener(obj: any, event: string, callback: Function): void;
  };

  const ZoomControlStyle: any;
  const Position: any;
}
