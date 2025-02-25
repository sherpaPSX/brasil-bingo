import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cron from "node-cron";
import { Message, Player, UserRequest, Word } from "@shared/types/game";

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

let connectedUsers = new Map<string, Player>();
let messages: Message[] = [];

const getRandomWords = (): Word[] =>
  BUZZWORDS.sort(() => Math.random() - 0.5)
    .slice(0, 25)
    .map((word, index) => ({ index, title: word }));

const getCurrentTime = () =>
  new Date().toLocaleString("cs-CZ", {
    timeZone: "Europe/Prague",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const findPlayerBySocketId = (
  socketId: string,
  callback: (userId: string, player: Player) => void
): void => {
  for (const [id, player] of connectedUsers.entries()) {
    if (player.id === socketId) {
      callback(id, player);
      return;
    }
  }
  console.error(`Player not found for socket ${socketId}`);
};

io.on("connection", (socket) => {
  socket.on("user:add", ({ username, id }: UserRequest) => {
    let player = connectedUsers.get(id);

    if (!player) {
      player = {
        id: socket.id,
        username,
        words: getRandomWords(),
        selectedWords: [],
        bingo: false,
      };
      connectedUsers.set(id, player);
    } else {
      player.id = socket.id;
      connectedUsers.set(id, player);
    }

    socket.emit("player:init", player);
  });

  socket.on("player:selectWord", (word: Word) => {
    findPlayerBySocketId(socket.id, (userId, player) => {
      if (player.selectedWords) {
        const index = player.selectedWords.findIndex(
          (w) => w.index === word.index
        );
        index === -1
          ? player.selectedWords.push(word)
          : player.selectedWords.splice(index, 1);
        connectedUsers.set(userId, player);
      }
    });
  });

  cron.schedule(
    "0 0 * * *",
    () => {
      connectedUsers = new Map();
      messages = [];
    },
    {
      scheduled: true,
      timezone: "Europe/Prague",
    }
  );

  socket.on("users:get", () =>
    io.emit("users:post", Array.from(connectedUsers.values()))
  );

  socket.on("bingo", () => {
    findPlayerBySocketId(socket.id, (userId, player) => {
      connectedUsers.set(userId, { ...player, bingo: true });

      messages.push({
        username: player.username,
        words: player.selectedWords.map((w) => w.title),
        message: "má Bingo se slovy",
        type: "bingo",
        currentTime: getCurrentTime(),
      } satisfies Message);
      io.emit("messages:update", messages[messages.length - 1]);
    });
  });

  socket.on("messages:get", () => {
    socket.emit("messages:all", messages);
  });

  socket.on("messages:add", (message: Message) => {
    messages.push(message);
    socket.broadcast.emit("messages:update", message);
  });
});

httpServer.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
