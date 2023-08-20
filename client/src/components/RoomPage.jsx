import React, { useCallback, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import useSocket from "../hooks/useSocket";
import peer from "../services/peer";

const RoomPage = () => {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const socket = useSocket();

  const handleUserJoined = useCallback(({ email, id }) => {
    setRemoteSocketId(id);
    console.log(`Email: ${email}, id: ${id}`);
  });

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      console.log("incoming call", { from, offer });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
      const answer = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, answer });
    },
    [socket]
  );

  const sendStream = () => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  };

  const handleCallAccepted = useCallback(
    ({ from, answer }) => {
      peer.setLocalDescription(answer);
      console.log("Call accepted");
      sendStream();
    },
    [myStream]
  );

  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleNegoNeedIncoming = useCallback(
    async ({ from, offer }) => {
      const answer = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, answer });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ from, answer }) => {
    await peer.setLocalDescription(answer);
  });

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);

    return () => {
      peer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
    };
  }, [handleNegotiationNeeded]);

  useEffect(() => {
    peer.peer.addEventListener("track", (event) => {
      const remoteStream = event.streams;
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncoming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncoming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegoNeedIncoming,
    handleNegoNeedFinal,
  ]);

  const handleCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });

    setMyStream(stream);
  };

  return (
    <div className="text-center pt-2">
      <h1>Room Page</h1>

      <h1>{remoteSocketId ? "Connected" : "No one in the room"}</h1>
      {remoteSocketId && (
        <button
          className="bg-green-800 text-white px-2 py-1"
          onClick={handleCall}
        >
          Call
        </button>
      )}
     
      {myStream && (
        <button
          className="bg-green-800 text-white px-2 py-1 ml-3"
          onClick={sendStream}
        >
          Send stream
        </button>
      )}
      <hr />

      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            url={myStream}
            height="250px"
            width="400px"
            playing
            muted
          />
        </>
      )}
      {remoteStream && (
        <>
          <h1>Remote Stream</h1>
          <ReactPlayer
            url={remoteStream}
            height="250px"
            width="400px"
            playing
          />
        </>
      )}
    </div>
  );
};

export default RoomPage;
