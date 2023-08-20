import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import useSocket from "../hooks/useSocket";

const LobbyPage = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const socket = useSocket();
  const navigate = useNavigate()


  const handleJoinRoom = useCallback((data) => {
    const {email, room} = data
    navigate(`/room/${room}`)
  }, [])

  useEffect(() => {
    socket.on("room:join", handleJoinRoom)

    return () => {
      socket.off("room:join", handleJoinRoom)
    }
  },[socket])

  const handleFormSubmit = useCallback(
    (e) => {
      e.preventDefault();

      socket.emit("room:join", { email, room });
    },
    [socket, email, room]
  );



  return (
    <div className="max-w-xs">
      <form onSubmit={handleFormSubmit} className="border p-3 border-slate-700">
        <div>
          <label htmlFor="email" className="text-md block">
            Email
          </label>
          <input
            className="border border-slate-900 w-full px-1 py-1"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="roomId" className="text-md block ">
            RoomId
          </label>
          <input
            className="border border-slate-900 w-full px-1 py-1"
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </div>

        <div>
          <button className="px-3 py-1 bg-green-700 text-white rounded mt-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LobbyPage;
