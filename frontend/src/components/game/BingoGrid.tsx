import React, { useEffect, useState } from "react";
import { Word } from "../../types/Word";
import { useSocket } from "../../socket/socketContext";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Player } from "@shared/types/game";

const BingoGrid: React.FC = () => {
  const { socket, words, selectedWords, bingo } = useSocket();
  const [selected, setSelected] = useState<Player["selectedWords"]>([]);

  useEffect(() => {
    setSelected(selectedWords);
  }, [selectedWords]);

  const handleCellClick = (word: Word) => {
    setSelected((prev) => {
      if (prev.some((w) => w.index === word.index)) {
        return prev.filter((w) => w.index !== word.index);
      }
      return [...prev, word];
    });
    socket?.emit("player:selectWord", word);
  };

  const isWordSelected = (index: number) => {
    return selected.some((word) => word.index === index);
  };

  return (
    <div className="bg-black/30 p-4 rounded-lg">
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
    </div>
  );
};

export default BingoGrid;
