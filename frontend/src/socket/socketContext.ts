import { Player } from "@shared/types/game";
import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  words: Player["words"];
  setWords: (words: Player["words"]) => void;
  selectedWords: Player["selectedWords"];
  setSelectedWords: (selectedWords: Player["selectedWords"]) => void;
  gameStarted: boolean;
  setGameStarted: (gameStarted: boolean) => void;
  bingo: Player["bingo"];
  setBingo: (bingo: Player["bingo"]) => void;
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
