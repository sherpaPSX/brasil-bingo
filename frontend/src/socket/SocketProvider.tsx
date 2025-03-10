import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "./socketContext";
import { Player } from "@shared/types/game";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [words, setWords] = useState<Player["words"]>([]);
  const [selectedWords, setSelectedWords] = useState<Player["selectedWords"]>(
    []
  );
  const [bingo, setBingo] = useState<Player["bingo"]>(false);

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem("userId", userId);
    }

    const username = localStorage.getItem("username");
    const newSocket = io(SOCKET_SERVER_URL);

    setSocket(newSocket);

    newSocket.on("connect", () => {
      if (username) {
        newSocket.emit("user:add", {
          username,
          id: userId,
        });
      }
    });

    newSocket.on("player:init", (player: Player) => {
      setWords(player.words);
      setSelectedWords(player.selectedWords);
      setBingo(player.bingo);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        words,
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
