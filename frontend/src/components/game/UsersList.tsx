import { useEffect, useState } from "react";
import { useSocket } from "../../socket/socketContext";
import { Player } from "../../types/Player";
import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";

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
    <div className="mb-8">
      <h2 className="text-xl font-bold border-b-2 mb-3">Seznam hráčů</h2>
      <ul className="list-none ps-0">
        {users.map((user) => (
          <li
            key={user.id}
            className={cn("flex items-center gap-2", {
              "text-green-500": user.bingo,
            })}
          >
            <span className="block rounded p-1">
              <UserRound size="24" absoluteStrokeWidth />
            </span>
            <span className="">{user.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
