import { useEffect, useState } from "react";
import {
  addDays,
  differenceInSeconds,
  set,
  nextMonday,
  isWeekend,
} from "date-fns";

const getNextExecutionTime = (): number => {
  const now = new Date();
  let nextExecution = set(now, {
    hours: 10,
    minutes: 30,
    seconds: 0,
    milliseconds: 0,
  });

  // Pokud je už po 10:30 dnes, nastavíme další běh na další den
  if (now > nextExecution) {
    nextExecution = addDays(nextExecution, 1);
  }

  // Pokud je další den víkend, posuneme na pondělí
  if (isWeekend(nextExecution)) {
    nextExecution = nextMonday(nextExecution);
  }

  return differenceInSeconds(nextExecution, now); // Vrátí zbývající sekundy
};

export default function Countdown() {
  const [totalSeconds, setTotalSeconds] = useState(getNextExecutionTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSeconds(getNextExecutionTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="bg-black/30 p-4 rounded-lg text-white text-center">
      <div className="text-2xl">Čas do zahájení:</div>
      <div className="text-6xl">{formatTime(totalSeconds)}</div>
    </div>
  );
}
