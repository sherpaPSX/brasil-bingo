import React, { useEffect, useRef } from "react";
import { useSocket } from "../../socket/socketContext";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  MessageRequest,
  type Message,
  type MessageResponse,
} from "@shared/types/game";

export default function Messages() {
  const { socket } = useSocket();
  const [messages, setMessages] = React.useState<Message[]>([]);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("messages:get");

    socket.on("messages:post", (messages: MessageResponse[]) => {
      setMessages(messages);
    });

    socket.on("message:new", (message: MessageRequest) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message:new");
    };
  }, [socket]);

  return (
    <div className="h-full">
      <h3>Game stats</h3>
      <ScrollArea className="h-80 bg-gray-700 w-full  border mt-3 text-xs p-3 flex-1">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn("mb-1 flex", {
              "text-yellow-300": message.type === "bingo",
            })}
          >
            <span className="me-2 italic">{message.currentTime}</span>
            <div>
              <span className="font-bold text-sm me-2">{message.username}</span>
              <span className="me-2 italic">{message.message}</span>
              <span className={cn("font-bold text-sm")}>
                {message.words.join(", ")}
              </span>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </ScrollArea>
    </div>
  );
}
