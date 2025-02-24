import BingoGrid from "./BingoGrid";
import { useSocket } from "../../socket/socketContext";
import { Button } from "../ui/button";
import Stats from "../stats/Stats";
import { ResetGameButton } from "./ResetGameButton";

export default function Game() {
  const { socket, gameStarted, bingo } = useSocket();

  const startGame = () => {
    if (socket) {
      socket.emit("game:start");
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 h-full">
        <div className="col-span-2 flex flex-col items-center justify-center bg-background ">
          <div className="w-full">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-3xl font-bold">Word Bingo</h1>
              {!gameStarted && (
                <Button onClick={startGame} className="min-w-[120px]">
                  New Game
                </Button>
              )}
              {bingo !== undefined && <ResetGameButton />}
            </div>
          </div>
          {gameStarted && <BingoGrid />}
          <div className="h-full w-full flex items-end justify-center">
            <footer className="bg-gray-800 w-full text-center p-2 bg-text-center text-sm text-white">
              <p className="">
                Made with{" "}
                <span className="text-yellow-300">Lukáš "Sherpa" Werner</span>
              </p>
            </footer>
          </div>
        </div>
        <div className="bg-gray-800 flex flex-col justify-between text-white p-4">
          <Stats />
        </div>
      </div>
    </>
  );
}
