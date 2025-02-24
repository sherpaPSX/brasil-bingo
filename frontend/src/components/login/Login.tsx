import React from "react";

export default function Login() {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = (event.target as HTMLFormElement).username.value;

    // On submit save to local storage
    localStorage.setItem("username", username);

    // Trigger custom event for the same window
    window.dispatchEvent(new Event("localStorageChange"));
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" name="username" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
