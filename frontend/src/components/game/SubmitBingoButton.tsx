import { useSocket } from "@/socket/socketContext";
import { checkBingo } from "@/utils/checkBingo";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function SubmitBingoButton() {
  const { socket, bingo, selectedWords } = useSocket();
  const [showSubmitButton, setShowSubmitButton] = useState(false);

  useEffect(() => {
    const [won] = checkBingo(selectedWords);
    setShowSubmitButton(won);
  }, [selectedWords]);

  const submitBingo = () => {
    socket?.emit(
      "bingo",
      selectedWords.map((word) => word.title)
    );
  };

  return (
    <div className="flex justify-center pt-6 ">
      {showSubmitButton && !bingo && (
        <Button
          size="lg"
          className="text-3xl p-8 cursor-pointer"
          variant="destructive"
          onClick={submitBingo}
        >
          Potvrdit BINGO
        </Button>
      )}
    </div>
  );
}
