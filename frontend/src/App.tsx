import { useState, useEffect } from "react";
import { GreetService } from "../bindings/changeme";
import { Events } from "@wailsio/runtime";
import { Button, TextField } from "@stacc/prism-ui";

// Define interfaces for our types
interface TimeData {
  data: string;
}

declare global {
  interface Window {
    GreetService: typeof GreetService;
  }
}

export function App() {
  const [name, setName] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // Subscribe to time events
    const unsubscribe = Events.On("time", (timeData: TimeData) => {
      console.log("timeData", timeData);
      setTime(timeData.data);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const handleGreet = async () => {
    try {
      const greetingName = name.trim() || "anonymous";
      console.log("greetingName", greetingName);
      const response = await GreetService.Greet(greetingName);
      console.log("response", response);
      setResult(response);
    } catch (err) {
      console.error("Error in greeting:", err);
    }
  };

  return (
    <div className="bg-background-default h-screen p-5">
      <h1>Hello World</h1>
      <div className="flex flex-col gap-2 w-fit">
        <TextField value={name} onChange={setName} />
        <Button label="Greet" onClick={handleGreet} className="w-fit" />
      </div>
      {result && <div>{result}</div>}
      {time && <div>Current time: {time}</div>}
    </div>
  );
}
