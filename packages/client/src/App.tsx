import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetch("/api/greet")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching message:", error));
  }, []);

  return <p className="font-bold text-3xl p-4">{message}</p>;
}

export default App;
