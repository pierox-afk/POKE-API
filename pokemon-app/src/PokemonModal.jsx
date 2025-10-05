import React, { useState, useEffect } from "react";
import axios from "axios";
import StatsRadarChart from "./StatsRadarChart";
import TypeEffectiveness from "./TypeEffectiveness";
import "./PokemonModal.css";
import "./Animations.css";

const PokemonModal = ({
  name,
  onClose,
  favorites,
  toggleFavorite,
  onPokemonSelect,
}) => {
  const [pokemon, setPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState(null);
  const [damageRelations, setDamageRelations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShiny, setShowShiny] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    setDamageRelations(null);
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((res) => {
        const pokemonData = res.data;
        setPokemon(pokemonData);
        const audio = new Audio(pokemonData.cries.latest);
        audio.volume = 0.1;
        audio.play();

        const typePromises = pokemonData.types.map((t) =>
          axios.get(t.type.url)
        );
        const speciesPromise = axios.get(pokemonData.species.url);

        return Promise.all([...typePromises, speciesPromise]);
      })
      .then((results) => {
        const typeResponses = results.slice(0, -1);
        const speciesRes = results[results.length - 1];

        const multipliers = {};
        const allTypes = typeResponses.flatMap((res) =>
          res.data.damage_relations.double_damage_from
            .map((t) => t.name)
            .concat(
              res.data.damage_relations.half_damage_from.map((t) => t.name)
            )
            .concat(res.data.damage_relations.no_damage_from.map((t) => t.name))
        );
        const uniqueTypes = [...new Set(allTypes)];

        uniqueTypes.forEach((type) => (multipliers[type] = 1));

        typeResponses.forEach((res) => {
          const relations = res.data.damage_relations;
          relations.double_damage_from.forEach(
            (t) => (multipliers[t.name] *= 2)
          );
          relations.half_damage_from.forEach(
            (t) => (multipliers[t.name] *= 0.5)
          );
          relations.no_damage_from.forEach((t) => (multipliers[t.name] *= 0));
        });

        const finalRelations = {
          weaknesses: [],
          resistances: [],
          immunities: [],
        };

        for (const type in multipliers) {
          const multiplier = multipliers[type];
          if (multiplier > 1) {
            finalRelations.weaknesses.push({ name: type, multiplier });
          } else if (multiplier < 1 && multiplier > 0) {
            finalRelations.resistances.push({ name: type, multiplier });
          } else if (multiplier === 0) {
            finalRelations.immunities.push({ name: type, multiplier: 0 });
          }
        }

        setDamageRelations(finalRelations);

        return axios.get(speciesRes.data.evolution_chain.url);
      })
      .then((evoRes) => {
        const chain = [];
        let evoData = evoRes.data.chain;
        while (evoData) {
          chain.push({
            name: evoData.species.name,
            id: evoData.species.url.split("/").filter(Boolean).pop(),
          });
          evoData = evoData.evolves_to[0];
        }
        setEvolutionChain(chain);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [name]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (loading || !pokemon) {
    return (
      <div className="modal-bg" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="loader-container">
            <div className="pokeball-loader"></div>
          </div>
        </div>
      </div>
    );
  }

  const imageUrl = showShiny
    ? pokemon.sprites.front_shiny
    : pokemon.sprites.front_default;

  const primaryType = pokemon.types[0].type.name;

  return (
    <div className="modal-bg" onClick={onClose}>
      <div
        className={`modal-content modal-type-${primaryType}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <div className="pokemon-details">
          <div className="pokemon-header">
            <h2 className="pokemon-name">{pokemon.name}</h2>
            <button
              className="favorite-btn-modal"
              onClick={() => toggleFavorite(pokemon.id)}
            >
              {favorites.has(pokemon.id) ? "❤️" : "🤍"}
            </button>
          </div>

          {imageLoading && (
            <div className="image-loader">
              <div className="pokeball-loader-small"></div>
            </div>
          )}
          <img
            src={imageUrl}
            alt={pokemon.name}
            className="pokemon-img"
            onLoad={handleImageLoad}
            style={{ display: imageLoading ? "none" : "block" }}
          />

          <button
            className="shiny-toggle"
            onClick={() => setShowShiny(!showShiny)}
          >
            {showShiny ? "✨ Show Normal" : "✨ Show Shiny"}
          </button>

          <div className="pokemon-stats-container">
            <div className="pokemon-info">
              <p>
                <strong>Type:</strong>{" "}
                {pokemon.types.map((t) => t.type.name).join(", ")}
              </p>
              <p>
                <strong>Height:</strong> {pokemon.height / 10} m
              </p>
              <p>
                <strong>Weight:</strong> {pokemon.weight / 10} kg
              </p>
            </div>

            <div className="stats-chart-container">
              <StatsRadarChart stats={pokemon.stats} type={primaryType} />
            </div>
          </div>

          <TypeEffectiveness relations={damageRelations} />

          {evolutionChain && evolutionChain.length > 1 && (
            <div className="evolutions-container">
              <h3>Evolutions</h3>
              <div className="evolutions-list">
                {evolutionChain.map((evo, index) => (
                  <React.Fragment key={evo.id}>
                    <div
                      className="evolution-item"
                      onClick={() =>
                        pokemon.name !== evo.name && onPokemonSelect(evo.name)
                      }
                    >
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                        alt={evo.name}
                      />
                      <span>{evo.name}</span>
                    </div>
                    {index < evolutionChain.length - 1 && (
                      <span className="evolution-arrow">➤</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonModal;
