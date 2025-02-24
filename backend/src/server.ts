import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cron from "node-cron";
import {
  Message,
  MessageRequest,
  Player,
  UserRequest,
  Word,
} from "@shared/types/game";

const app = express();
const PORT = process.env.PORT || 3001;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000" },
});

const BUZZWORDS = [
  "hotfix",
  "release",
  "regresní testy",
  "analýza",
  "planning",
  "blocker",
  "prs",
  "int",
  "produkce",
  "sprint",
  "smoke testy",
  "tablet",
  "americká hypoteká",
  "přepis",
  "backend",
  "frontend",
  "synchro",
  "brasil browser",
  "CMR",
  "Smart",
  "kapacita",
  "business",
  "pilot",
  "defekt",
  "balíčky",
  "databáze",
  "AWOS",
  "hyporisk",
];

const connectedUsers = new Map<string, Player>();
let messages: Message[] = [];
let gameStarted = false;

const getRandomWords = (): Word[] =>
  BUZZWORDS.sort(() => Math.random() - 0.5)
    .slice(0, 25)
    .map((word, index) => ({ index, title: word }));

const getCurrentTime = () =>
  new Date().toLocaleTimeString("cs-CZ", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const startGame = () => {
  console.log("Starting game");
  connectedUsers.forEach((player) =>
    io.to(player.id).emit("player:init", player)
  );
  gameStarted = true;
  io.emit("game:status", { started: gameStarted });
};

io.on("connection", (socket) => {
  socket.on("user:add", ({ username, id }: UserRequest) => {
    const player = connectedUsers.get(id || socket.id) || {
      id: socket.id,
      username,
      words: getRandomWords(),
      selectedWords: [],
    };
    player.id = socket.id;
    connectedUsers.set(id || socket.id, player);
    socket.emit("player:init", player);
    io.emit("users:post", Array.from(connectedUsers.values()));
  });

  socket.on("player:selectWord", (word: Word) => {
    const player = Array.from(connectedUsers.values()).find(
      (p) => p.id === socket.id
    );
    if (!player) return;

    if (player.selectedWords) {
      const index = player.selectedWords.findIndex(
        (w) => w.index === word.index
      );
      index === -1
        ? player.selectedWords.push(word)
        : player.selectedWords.splice(index, 1);
      connectedUsers.set(player.id, player);
      io.to(socket.id).emit("player:init", player);

      messages.push({
        username: player.username,
        words: [word.title],
        message: "označil slovo",
        type: "mark",
        currentTime: getCurrentTime(),
      } satisfies Message);
      io.emit("message:new", messages[messages.length - 1]);
    }
  });

  cron.schedule("30 10 * * 1-5", startGame);

  cron.schedule("15 11 * * 1-5", () => {
    socket.on("game:reset", () => {
      gameStarted = false;
      connectedUsers.forEach((player) => {
        player.selectedWords = [];
        player.bingo = undefined;
        player.words = getRandomWords();
        io.to(player.id).emit("player:init", player);
      });

      io.emit("game:status", { started: gameStarted });
      messages = [];
      io.emit("messages:post", messages);

      // clear all unconnected users
      connectedUsers.forEach((player, id) => {
        if (!io.sockets.sockets.has(id)) connectedUsers.delete(id);
      });
    });
  });

  socket.on("users:get", () =>
    io.emit("users:post", Array.from(connectedUsers.values()))
  );

  socket.on("game:status", () =>
    io.emit("game:status", { started: gameStarted })
  );

  socket.on("bingo", (bingoWords: string[]) => {
    const player = connectedUsers.get(socket.id);
    if (!player) return;
    player.bingo = { time: Date.now() };
    messages.push({
      username: player.username,
      words: bingoWords,
      message: "má Bingo se slovy",
      type: "bingo",
      currentTime: getCurrentTime(),
    } satisfies Message);
    io.to(socket.id).emit("player:init", player);
    io.emit("message:new", messages[messages.length - 1]);
  });

  socket.on("messages:get", () => io.emit("messages:post", messages));
  socket.on("message:new", (message: MessageRequest) => {
    messages.push(message);
    io.emit("message:new", message);
  });

  socket.on("disconnect", () => {
    connectedUsers.delete(socket.id);
    io.emit("users:post", Array.from(connectedUsers.values()));
  });
});

httpServer.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
