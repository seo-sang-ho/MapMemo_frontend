import { useEffect, useRef } from 'react';
import MapView  from "./components/Mapview"

function App() {
  return (
    <div style={{width: "100vW", height: "100vh"}}>
      <h1>카카오맵</h1>
      <MapView />
    </div>
  );
}

export default App;