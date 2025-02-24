import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "./socketContext";
import { Player } from "@shared/types/game";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [words, setWords] = useState<Player["words"]>([]);
  const [selectedWords, setSelectedWords] = useState<Player["selectedWords"]>(
    []
  );
  const [bingo, setBingo] = useState<Player["bingo"]>(undefined);

  useEffect(() => {
    let storedSocketId = localStorage.getItem("socketId");
    const username = localStorage.getItem("username");

    const newSocket = io(SOCKET_SERVER_URL);

    setSocket(newSocket);

    newSocket.on("connect", () => {
      if (!storedSocketId && newSocket.id) {
        storedSocketId = newSocket.id;
        localStorage.setItem("socketId", storedSocketId);
      }

      if (username) {
        newSocket.emit("user:add", {
          username,
          id: storedSocketId,
        });
      }
    });

    newSocket.on("player:init", (player: Player) => {
      setWords(player.words);
      setSelectedWords(player.selectedWords);
      setBingo(player.bingo);
    });

    newSocket.emit("game:status");

    newSocket.on("game:status", ({ started }: { started: boolean }) => {
      setGameStarted(started);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        gameStarted,
        words,
        setWords,
        selectedWords,
        setSelectedWords,
        bingo,
        setBingo,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
