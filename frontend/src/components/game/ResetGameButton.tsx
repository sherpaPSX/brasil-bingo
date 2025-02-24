import { useSocket } from "@/socket/socketContext";
import { Button } from "../ui/button";

export const ResetGameButton = () => {
  const { socket } = useSocket();
  const resetGameHandler = () => {
    if (socket) {
      socket.emit("game:reset");
    }
  };
  return <Button onClick={resetGameHandler}>Reset Game</Button>;
};
