import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";

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
    <div className="flex min-h-[450px] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="mb-4">
            <div className="flex flex-col gap-2 mb-4">
              <Label htmlFor="username">Uživetelské jméno</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                required
                type="text"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Vstoupit do hry
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
