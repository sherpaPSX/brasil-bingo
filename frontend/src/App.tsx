import Game from "./components/game/Game";
import Login from "./components/login/Login";
import useLocalStorage from "./hooks/useLocalStorage";
import { SocketProvider } from "./socket/SocketProvider";

function App() {
  const username = useLocalStorage("username");

  return (
    <div style={{ height: "100dvh" }}>
      {username ? (
        <SocketProvider>
          <Game />
        </SocketProvider>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
