import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "./socketContext";

const SOCKET_SERVER_URL = "http://localhost:3001"; // Replace with your server URL

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    let storedSocketId = localStorage.getItem("socketId");
    const username = localStorage.getItem("username");

    const newSocket = io(SOCKET_SERVER_URL);

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected with socket ID:", newSocket.id);

      if (!storedSocketId && newSocket.id) {
        storedSocketId = newSocket.id;
        localStorage.setItem("socketId", storedSocketId);
      }

      if (username) {
        newSocket.emit("addUser", {
          username,
          socketId: storedSocketId,
        });
      }
    });

    newSocket.emit("gameStatus");

    newSocket.on("gameStatus", ({ started }: { started: boolean }) => {
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
    <SocketContext.Provider value={{ socket, gameStarted }}>
      {children}
    </SocketContext.Provider>
  );
};
