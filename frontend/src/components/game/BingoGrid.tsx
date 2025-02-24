import React, { useEffect, useState } from "react";
import { Word } from "../../types/Word";
import { useSocket } from "../../socket/socketContext";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { MessageRequest } from "@shared/types/game";

type WordFE = Word & { marked: boolean };

const winPatterns = [
  // Rows
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // Columns
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // Diagonals
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

const BingoGrid: React.FC = () => {
  const { socket } = useSocket();

  const username = localStorage.getItem("username");
  const [hasWon, setHasWon] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [words, setWords] = useState<WordFE[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.on("setWords", (newWords: Word[]) => {
      const words = newWords.map((word) => ({ ...word, marked: false }));
      setWords(words);
    });

    return () => {
      socket.off("setWords");
    };
  }, [socket]);

  const currentTime = new Date().toLocaleTimeString("cs-CZ", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const checkBingo = (selected: Word[]): [boolean] => {
    const winningPattern = winPatterns.find((pattern) =>
      pattern.every((index) => selected.some((word) => word.index === index))
    );
    return [!!winningPattern];
  };

  const handleCellClick = (index: number) => {
    if (hasWon) return;
    const newBoard = words.map((word) =>
      word.index === index ? { ...word, marked: !word.marked } : word
    );
    const selectedWords = newBoard.filter((word) => word.marked);
    const [bingoWon] = checkBingo(selectedWords);

    if (!words[index].marked) {
      const updateMessage: MessageRequest = {
        username: username || "",
        words: [newBoard[index].title],
        message: "označil",
        type: "mark",
        currentTime,
      };
      socket?.emit("update", updateMessage);
    }

    setWords(newBoard);

    setShowSubmitButton(bingoWon);
  };

  const submitBingo = () => {
    const selectedWords = words.filter((word) => word.marked);
    socket?.emit(
      "bingo",
      selectedWords.map((word) => word.title)
    );
    const bingoMessage: MessageRequest = {
      username: username || "",
      words: selectedWords.map((word) => word.title),
      message: "má Bingo se slovy",
      type: "bingo",
      currentTime,
    };
    socket?.emit("update", bingoMessage);
    setHasWon(true);
  };

  return (
    <div>
      <div className="grid grid-cols-5 gap-2 ">
        {words.map((word) => {
          return (
            <button
              key={word.index}
              className={cn("word-card", {
                selected: word.marked,
              })}
              onClick={() => handleCellClick(word.index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleCellClick(word.index);
                }
              }}
              aria-label={`${word.title}${word.marked ? " (marked)" : ""}`}
            >
              <span className="word-card__inner text-center text-xs break-words sm:text-base relative z-10 font-bold ">
                {word.title}
              </span>
              {word.marked && (
                <Check
                  className="absolute right-1 top-1 h-3 w-3 text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:h-4 sm:w-4"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
      <div>
        {showSubmitButton && !hasWon && (
          <Button size="lg" variant="destructive" onClick={submitBingo}>
            Potvrdit Bingo
          </Button>
        )}
      </div>
    </div>
  );
};

export default BingoGrid;
