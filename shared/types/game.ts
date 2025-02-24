export interface Message {
  username: string;
  words: string[];
  message: string;
  type: "mark" | "bingo";
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
  bingo?: {
    time: number;
  };
}

export type PlayerResponse = Player;
export type PlayerRequest = Player;

export type PlayersList = Pick<Player, "bingo" | "username" | "id">[];

export interface UserRequest {
  id: Player["id"];
  username: Player["username"];
}

export interface PlayersList {
  // Define the structure of PlayersList
}

export interface UserRequest {
  // Define the structure of UserRequest
}
