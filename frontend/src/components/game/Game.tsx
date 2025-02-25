import BingoGrid from "./BingoGrid";
import Stats from "../stats/Stats";

import SubmitBingoButton from "./SubmitBingoButton";

export default function Game() {
  return (
    <>
      <div className="grid grid-cols-3 flex-1">
        <div className="col-span-2 flex flex-col items-center justify-center body ">
          <div className="">
            <div className="mb-6 text-center">
              <h1 className="mb-2 bg-black/40 px-8 py-3 rounded-2xl  font-bold text-white text-4xl text-shadow">
                <span className="text-yellow-300">B</span>rasil{" "}
                <span className="text-yellow-300">B</span>uzzword{" "}
                <span className="text-yellow-300">B</span>ingo
              </h1>
            </div>
          </div>
          <BingoGrid />
          <SubmitBingoButton />
        </div>

        <Stats />
      </div>
      <div className="w-full flex items-end justify-center">
        <footer className="bg-gray-800/80 w-full text-center p-2 bg-text-center text-sm text-white">
          <p className="">
            Made by{" "}
            <span className="text-yellow-300">Lukáš "Sherpa" Werner</span>
          </p>
        </footer>
      </div>
    </>
  );
}
