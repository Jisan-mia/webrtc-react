import { useEffect, useState } from "react";
import peerConnection from "./peer";
function App() {
  const [myStream, setMyStream] = useState(null);
  console.log(peerConnection);

  useEffect(() => {
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      console.log(stream);
    })();

    peerConnection.createOffer().then((offer) => console.log(offer));
  }, []);

  return (
    <>
      <div className="bg-green-400">
        <h1 className="text-center text-4xl">This is a Heading</h1>
      </div>
    </>
  );
}

export default App;
