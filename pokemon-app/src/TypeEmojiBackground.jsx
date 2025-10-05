import React from "react";
import "./TypeEmojiBackground.css";

const TypeEmojiBackground = () => {
  const emojis = [
    "🔥", // Fire
    "💧", // Water
    "🌿", // Grass
    "⚡️", // Electric
    "❄️", // Ice
    "🥊", // Fighting
    "☠️", // Poison
    "🏜️", // Ground
    "🦅", // Flying
    "🔮", // Psychic
    "🐞", // Bug
    "🪨", // Rock
    "👻", // Ghost
    "🐉", // Dragon
    "🌑", // Dark
    "⚙️", // Steel
    "✨", // Fairy
    "⚪️", // Normal
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
