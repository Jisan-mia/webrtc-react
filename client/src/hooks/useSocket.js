import { useContext } from "react"
import { SocketContext } from "../context/SocketContext"

const useSocket = () => {
  const socket = useContext(SocketContext)
  return socket
}
export default useSocket