import { useEffect, useState } from "react";
import { useSocket } from "../../socket/socketContext";
import { Player } from "../../types/Player";
import { cn } from "@/lib/utils";

export default function UsersList() {
  const { socket } = useSocket();
  const [users, setUsers] = useState<Player[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("users:get");

    socket.on("users:post", (userList: Player[]) => {
      setUsers(userList);
    });

    return () => {
      socket.off("users");
    };
  }, [socket]);

  return (
    <div className="h-full">
      <h2 className="text-xl font-bold">Seznam hráčů</h2>
      <ul className="list-disc pl-5">
        {users.map((user) => (
          <li
            key={user.id}
            className={cn({
              "text-green-500": user.bingo,
            })}
          >
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}
