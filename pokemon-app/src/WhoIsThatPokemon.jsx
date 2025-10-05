import React, { useState, useEffect, useCallback } from "react";
import "./WhoIsThatPokemon.css";

const WhoIsThatPokemon = ({ allPokemons, onClose }) => {
  const [answer, setAnswer] = useState(null);
  const [options, setOptions] = useState([]);
  const [gameState, setGameState] = useState("playing"); // 'playing', 'revealed'
  const [isHiding, setIsHiding] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => parseInt(localStorage.getItem("pokemon-minigame-highscore")) || 0
  );

  const startNewRound = useCallback(() => {
    setGameState("playing");
    setIsHiding(false);

    const shuffled = [...allPokemons].sort(() => 0.5 - Math.random());
    const selectedPokemons = shuffled.slice(0, 4);

    if (selectedPokemons.length < 4) {
      onClose();
      return;
    }

    const correctPokemon = selectedPokemons[0];
    setAnswer(correctPokemon);

    const shuffledOptions = selectedPokemons.sort(() => 0.5 - Math.random());
    setOptions(shuffledOptions);
  }, [allPokemons, onClose]);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("pokemon-minigame-highscore", score);
    }
  }, [score, highScore]);

  const handleGuess = (pokemon) => {
    if (gameState !== "playing") return;

    const clickSound = new Audio(
      "https://www.myinstants.com/media/sounds/pokedex-select.mp3"
    );
    clickSound.play();

    setGameState("revealed");

    if (pokemon.id === answer.id) {
      setScore(score + 1);
    } else {
      setScore(0);
    }

    setTimeout(() => {
      setIsHiding(true); // Start hiding transition
      setTimeout(() => {
        startNewRound(); // Change pokemon after it's hidden
      }, 500); // This should match the transition duration
    }, 1500);
  };

  if (!answer) {
    return <div className="minigame-modal-bg">Loading minigame...</div>;
  }

  return (
    <div className="minigame-modal-bg" onClick={onClose}>
      <div
        className="minigame-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Who's That Pokémon?</h2>
        <div className="scores">
          <span>Score: {score}</span>
          <span>High Score: {highScore}</span>
        </div>
        <div className="pokemon-image-container">
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${answer.id}.png`}
            alt="pokemon silhouette"
            className={`pokemon-silhouette ${
              gameState === "revealed" && !isHiding ? "revealed" : ""
            }`}
          />
        </div>
        <div className="options-container">
          {options.map((pokemon) => (
            <button
              key={pokemon.id}
              className={`option-btn ${
                gameState === "revealed" && pokemon.id === answer.id
                  ? "correct"
                  : ""
              } ${gameState === "revealed" ? "disabled" : ""}`}
              onClick={() => handleGuess(pokemon)}
            >
              {pokemon.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhoIsThatPokemon;
