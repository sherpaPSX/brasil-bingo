import { Word } from "./Word";

export interface Player {
  id: string;
  username: string;
  words?: Word[];
  bingo?: {
    time: number;
    bingoWords: Word["title"][];
  };
}
