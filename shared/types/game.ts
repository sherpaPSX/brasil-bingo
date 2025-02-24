export interface Message {
  username: string;
  words: string[];
  message: string;
  type: string;
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
  words?: Word[];
  selectedWords?: Word[];
  bingo?: {
    time: number;
    bingoWords: Word["title"][];
  };
}

export type PlayerResponse = Player;
export type PlayerRequest = Player;
