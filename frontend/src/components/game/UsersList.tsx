import { useEffect, useState } from "react";
import { useSocket } from "../../socket/socketContext";
import { Player } from "../../types/Player";

export default function UsersList() {
  const { socket } = useSocket();
  const [users, setUsers] = useState<Player[]>([]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("getUsers");

    socket.on("users", (userList: Player[]) => {
      console.log("users: ", userList);
      setUsers(userList);
    });

    return () => {
      socket.off("users");
    };
  }, [socket]);

  return (
    <div className="h-full">
      <h2 className="text-xl font-bold">Connected Users</h2>
      <ul className="list-disc pl-5">
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}
