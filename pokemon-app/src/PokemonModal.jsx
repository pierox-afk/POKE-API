import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PokemonModal({ name, onClose }) {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    if (name) {
      axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`).then((res) => {
        setPokemon(res.data);
      });
    }
  }, [name]);

  if (!name) return null;

  return (
    <div className="modal-bg">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        {!pokemon ? (
          <p>Cargando...</p>
        ) : (
          <div>
            <h2>{pokemon.name}</h2>
            <img
              className="pokemon-img"
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
            />
            <p>
              <strong>Peso:</strong> {pokemon.weight}
            </p>
            <p>
              <strong>Altura:</strong> {pokemon.height}
            </p>
            <p>
              <strong>Tipos:</strong>{" "}
              {pokemon.types.map((t) => t.type.name).join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
