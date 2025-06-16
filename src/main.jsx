import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Create bubbles dynamically
for (let i = 0; i < 40; i++) {
  const bubble = document.createElement("span");
  bubble.style.left = `${Math.random() * 100}%`;
  bubble.style.width = bubble.style.height = `${10 + Math.random() * 20}px`;
  bubble.style.animationDuration = `${5 + Math.random() * 10}s`;
  document.querySelector(".bubbles").appendChild(bubble);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
