import React, { useEffect, useState } from "react";
import { Word } from "../../types/Word";
import { useSocket } from "../../socket/socketContext";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

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
  const { socket, words, selectedWords, bingo } = useSocket();

  const [showSubmitButton, setShowSubmitButton] = useState(false);

  const checkBingo = (selected: Word[]): [boolean] => {
    const winningPattern = winPatterns.find((pattern) =>
      pattern.every((index) => selected.some((word) => word.index === index))
    );
    return [!!winningPattern];
  };

  const handleCellClick = (word: Word) => {
    socket?.emit("player:selectWord", word);
  };

  useEffect(() => {
    const [won] = checkBingo(selectedWords);
    setShowSubmitButton(won);
  }, [selectedWords]);

  const isWordSelected = (index: number) => {
    return selectedWords.some((word) => word.index === index);
  };

  const submitBingo = () => {
    socket?.emit(
      "bingo",
      selectedWords.map((word) => word.title)
    );
  };

  return (
    <div>
      <div className={cn("grid grid-cols-5 gap-2")}>
        {words &&
          words.length > 0 &&
          words.map((word) => {
            return (
              <button
                key={word.index}
                className={cn("word-card", {
                  selected: isWordSelected(word.index),
                  "pointer-events-none": bingo !== undefined,
                })}
                onClick={() => handleCellClick(word)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCellClick(word);
                  }
                }}
                disabled={bingo !== undefined}
                aria-label={`${word.title}${
                  isWordSelected(word.index) ? " (marked)" : ""
                }`}
              >
                <span className="word-card__inner text-center text-xs break-words sm:text-base relative z-10 font-bold ">
                  {word.title}
                </span>
                {isWordSelected(word.index) && (
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
        {showSubmitButton && !bingo && (
          <Button size="lg" variant="destructive" onClick={submitBingo}>
            Potvrdit Bingo
          </Button>
        )}
      </div>
    </div>
  );
};

export default BingoGrid;
