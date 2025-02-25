import React, { useEffect, useRef } from "react";
import { useSocket } from "../../socket/socketContext";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  MessageRequest,
  type Message,
  type MessageResponse,
} from "@shared/types/game";
import { Input } from "../ui/input";
import { Send } from "lucide-react";
import { Button } from "../ui/button";

export default function Messages() {
  const { socket } = useSocket();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [message, setMessage] = React.useState<string>("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("messages:get");

    const handleMessagesAll = (messages: MessageResponse[]) => {
      setMessages(messages);
    };

    const handleMessageUpdate = (message: MessageRequest) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("messages:all", handleMessagesAll);
    socket.on("messages:update", handleMessageUpdate);

    return () => {
      socket.off("messages:all", handleMessagesAll);
      socket.off("messages:update", handleMessageUpdate);
    };
  }, [socket]);

  const messageSubmitHandler = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    if (!message || !username) return;

    const newMessage: Message = {
      username,
      currentTime: new Date().toLocaleTimeString(),
      words: [],
      type: "userMessage",
      message,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    if (!socket) return;
    socket.emit("messages:add", newMessage satisfies Message);
    setMessage("");
  };

  return (
    <div>
      <ScrollArea className="h-96 bg-gray-700/80 w-full  border mt-3 text-xs p-3 border-white/30">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn("mb-2 flex", {
              "text-yellow-300": message.type === "bingo",
              "text-white": message.type === "userMessage",
            })}
          >
            <span className="me-2 italic">{message.currentTime}</span>
            <div>
              <span className="font-bold me-2">{message.username}</span>
              <span className="me-2 italic">{message.message}</span>
              <span className={cn("font-bold")}>
                {message.words.join(", ")}
              </span>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </ScrollArea>
      <form onSubmit={messageSubmitHandler}>
        <div className="flex gap-2 mt-2 border border-white/30 focus-within:border-white">
          <Input
            value={message}
            placeholder="Napiš něco ostatním..."
            className="border-0 focus-visible:ring-0 placeholder:text-white/50"
            onChange={(ev) => setMessage(ev.target.value)}
          />
          <Button
            type="submit"
            variant="link"
            className="text-white cursor-pointer hover:text-yellow-300"
          >
            <Send />
          </Button>
        </div>
      </form>
    </div>
  );
}
