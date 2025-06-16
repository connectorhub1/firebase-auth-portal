import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Create golden bubbles dynamically
const bubbleContainer = document.querySelector(".bubbles");
for (let i = 0; i < 40; i++) {
  const bubble = document.createElement("span");
  bubble.style.left = `${Math.random() * 100}%`;
  const size = 10 + Math.random() * 30;
  bubble.style.width = bubble.style.height = `${size}px`;
  bubble.style.animationDuration = `${5 + Math.random() * 10}s`;
  bubbleContainer.appendChild(bubble);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
