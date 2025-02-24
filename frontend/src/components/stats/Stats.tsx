import Messages from "../game/Messages";
import UsersList from "../game/UsersList";

export default function Stats() {
  return (
    <div className="bg-gray-800/80 flex flex-col justify-between text-white px-4 pt-4">
      <UsersList />
      <Messages />
    </div>
  );
}
