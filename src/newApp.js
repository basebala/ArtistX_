import React, { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  const fetchMessage = () => {
    fetch("http://localhost:8000/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  };

  return (
    <div className="App">
      <h1>{message}</h1>
      <button onClick={fetchMessage}>Fetch Message</button>
    </div>
  );
}

export default App;