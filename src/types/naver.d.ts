interface Window {
  naver: any;
}

declare namespace naver.maps {
  /* ================= Map ================= */
  class Map {
    constructor(el: HTMLElement, options?: MapOptions);
    setCenter(latlng: LatLng): void;
    setZoom(zoom: number): void;

    getOptions(key?: string): any;
    setOptions(key: string | object, value?: any): void;

    controls: any;
    mapTypes?: any;
  }

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
    mapTypes?: any;
    mapTypeId?: any;
  }

  /* ================= LatLng ================= */
  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  /* ================= Size / Point ================= */
  class Size {
    constructor(width: number, height: number);
  }

  class Point {
    constructor(x: number, y: number);
  }

  /* ================= Marker ================= */
  class Marker {
    constructor(options: {
      position: LatLng;
      map?: Map;
      icon?: {
        url: string;
        size?: Size;
        scaledSize?: Size;
        origin?: Point;
        anchor?: Point;
      };
    });
    setMap(map: Map | null): void;
  }

  /* ================= InfoWindow ================= */
  class InfoWindow {
    constructor(options: {
      content: string | HTMLElement;
    });
    open(map: Map, marker: Marker): void;
    close(): void;
  }

  /* ================= CustomControl ================= */
  class CustomControl {
    constructor(
      html: string | HTMLElement,
      options?: {
        position?: any;
      }
    );
    setMap(map: Map | null): void;
    getElement(): HTMLElement;
  }

  /* ================= Event ================= */
  namespace Event {
    function addListener(
      target: any,
      eventName: string,
      handler: (...args: any[]) => void
    ): void;

    function addDOMListener(
      target: HTMLElement,
      eventName: string,
      handler: (e: Event) => void
    ): void;

    function once(
      target: any,
      eventName: string,
      handler: (...args: any[]) => void
    ): void;
  }

  /* ================= Constants ================= */
  const ZoomControlStyle: any;
  const Position: any;
  const MapTypeId: any;
}
