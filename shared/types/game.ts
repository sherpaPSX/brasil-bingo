export interface Message {
  username: string;
  words: string[];
  message: string;
  type: "userMessage" | "bingo";
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
