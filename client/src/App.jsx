import { Route, Routes } from "react-router-dom";
import LobbyPage from "./components/LobbyPage";
import RoomPage from "./components/RoomPage";

function App() {
  
  return (
    <Routes>
      <Route path="/" element={<LobbyPage />} />
      <Route path="/room/:roomId" element={<RoomPage />} />
    </Routes>
  );
}

export default App;
