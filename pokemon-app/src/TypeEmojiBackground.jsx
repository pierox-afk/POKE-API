import React from "react";
import "./TypeEmojiBackground.css";

const TypeEmojiBackground = () => {
  const emojis = [
    "🔥",
    "💧",
    "🌿",
    "⚡️",
    "❄️",
    "🥊",
    "☠️",
    "🏜️",
    "🦅",
    "🔮",
    "🐞",
    "🪨",
    "👻",
    "🐉",
    "🌑",
    "⚙️",
    "✨",
    "⚪️",
  ];

  const longEmojiList = Array(4).fill(emojis).flat();

  const columns = Array.from({ length: 20 }).map((_, colIndex) => (
    <div
      key={colIndex}
      className={`emoji-column ${
        colIndex % 2 === 0 ? "animate-up" : "animate-down"
      }`}
    >
      {longEmojiList.map((emoji, emojiIndex) => (
        <span key={`${colIndex}-${emojiIndex}`} className="emoji">
          {emoji}
        </span>
      ))}
    </div>
  ));

  return <div className="emoji-background">{columns}</div>;
};

export default TypeEmojiBackground;
