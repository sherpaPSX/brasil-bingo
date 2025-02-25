import { useEffect, useState } from "react";
import { useSocket } from "../../socket/socketContext";
import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";
import { type UsersList } from "@shared/types/game";
import { Badge } from "../ui/badge";

export default function UsersList() {
  const { socket } = useSocket();
  const [users, setUsers] = useState<UsersList>([]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("users:get");

    socket.on("users:list", (userList: UsersList) => {
      setUsers(userList);
    });

    return () => {
      socket.off("users");
    };
  }, [socket]);

  return (
    <div className="mb-8">
      <h2 className="text-xl flex items-center gap-2 font-bold mb-3">
        <UserRound size="24" absoluteStrokeWidth />
        Seznam hráčů
      </h2>
      <ul className="list-none ps-0">
        {users.map((user) => (
          <li key={user.id} className={cn("flex items-center gap-2", {})}>
            <span className="">{user.username}</span>
            {user.bingo && <Badge variant="destructive">Bingo</Badge>}
          </li>
        ))}
      </ul>
    </div>
  );
}
