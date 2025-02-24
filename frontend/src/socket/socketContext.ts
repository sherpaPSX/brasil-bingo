import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  gameStarted: boolean;
  timeToStart?: number;
}

export const SocketContext = createContext<SocketContextType | undefined>(
  undefined
);

// Hook pro snadné použití socketu
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket musí být použit v rámci <SocketProvider>");
  }
  return context;
};
