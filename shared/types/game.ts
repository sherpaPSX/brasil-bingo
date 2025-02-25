export interface Message {
  username: string;
  words: string[];
  message: string;
  type: "userMessage" | "bingo" | "userConnected" | "userDisconnected";
  currentTime: string;
}

export type MessageResponse = Message;
export type MessageRequest = Message;
export type MessagesResponse = Message[];

export interface Word {
  index: number;
  title: string;
}

export interface Player {
  id: string;
  username: string;
  words: Word[];
  selectedWords: Word[];
  bingo: boolean;
}

export type PlayerResponse = Player;
export type PlayerRequest = Player;

export interface UserRequest {
  id: Player["id"];
  username: Player["username"];
}

export type UsersList = Array<{
  id: Player["id"];
  username: Player["username"];
  bingo: Player["bingo"];
}>;
