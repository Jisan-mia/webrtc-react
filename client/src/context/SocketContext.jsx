import React, { createContext, useMemo } from 'react'
import { io } from 'socket.io-client'

export const SocketContext = createContext(null)


export const SocketProvider = ({children}) => {
  const socket = useMemo(() => io('localhost:8000'), [])
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}