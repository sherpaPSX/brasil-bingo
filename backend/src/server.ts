import { log } from "console";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cron from "node-cron";
import { Message, MessageRequest } from "@shared/types/game";

const app = express();
const PORT = 3001;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const brasilBuzzwords = [
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
  "refactoring",
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

interface Word {
  index: number;
  title: string;
}

interface Player {
  id: string;
  username: string;
  words?: Word[];
  selectedWords?: Word[];
  bingo?: {
    time: number;
    bingoWords: Word["title"][];
  };
}

const connectedUsers = new Map<string, Player>();
const messages: Message[] = [];
let gameStarted = false;

// This function pick 25 random words from the brasilBuzzwords array
const setWordsToUser = (): Word[] => {
  const words = brasilBuzzwords.sort(() => Math.random() - 0.5).slice(0, 25);
  return words.map((word, i) => ({
    index: i,
    title: word,
  }));
};

function startGame() {
  // Emit only words which are set to the user socket id
  connectedUsers.forEach((player) => {
    io.to(player.id).emit("setWords", player.words);
  });
  gameStarted = true;
  io.emit("gameStatus", { started: gameStarted });
}

io.on("connection", (socket) => {
  socket.on("addUser", async ({ username, socketId }) => {
    console.log("addUser", username, socket.id);
    // Pokud už existuje hráč s tímto socketId, aktualizujeme jeho socket.id
    if (socketId && connectedUsers.has(socketId)) {
      const player = connectedUsers.get(socketId);
      if (player) {
        console.log(`User reconnected: ${username}`);

        player.id = socket.id; // Aktualizujeme ID
        connectedUsers.set(socketId, player); // Uložíme pod původním socketId
        if (gameStarted) {
          io.to(socket.id).emit("setWords", player.words); // Pošleme mu jeho slova
        }
      }
    } else {
      console.log(`New user connected: ${username}`);
      // Nový uživatel - ale ukládáme ho pod socketId z localStorage!
      connectedUsers.set(socketId, {
        id: socket.id,
        username,
        words: setWordsToUser(),
      });
      if (gameStarted) {
        io.to(socket.id).emit("setWords", connectedUsers.get(socketId)?.words);
      }
    }

    io.emit(
      "users",
      Array.from(connectedUsers.values()).map((user) => ({
        username: user.username,
        id: user.id,
        bingo: user.bingo,
      }))
    ); // Aktualizujeme seznam uživatelů
  });

  // I need set all users as game stats to the all connected users
  socket.on("getUsers", () => {
    io.emit("users", Array.from(connectedUsers.values()));
  });

  cron.schedule("30 10 * * 1-5", () => {
    startGame();
  });

  socket.on("startGame", () => {
    startGame();
  });

  socket.on("resetGame", () => {
    io.emit("gameReset");
  });

  socket.on("disconnect", () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`User disconnected: ${user.username}`);
      connectedUsers.delete(socket.id);
      io.emit("users", Array.from(connectedUsers.values()));
    }
  });

  socket.on("update", (message: MessageRequest) => {
    console.log(`New message`);
    io.emit("update", message);
    messages.push(message);
  });

  socket.on("getMessages", () => {
    io.emit("messages", messages);
  });

  socket.on("gameStatus", () => {
    io.emit("gameStatus", { started: gameStarted });
  });

  socket.on("bingo", (bingoWords: string[]) => {
    console.log("Bingo words: ", bingoWords);
    const user = connectedUsers.get(socket.id);
    if (user) {
      user.bingo = {
        time: Date.now(),
        bingoWords: bingoWords,
      };
      connectedUsers.set(socket.id, user);
      io.emit("users", Array.from(connectedUsers.values()));
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
