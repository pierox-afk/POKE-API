import React, { useEffect, useState } from "react";
import PokemonModal from "./PokemonModal";
import PokeballTransition from "./PokeballTransition";
import WhoIsThatPokemon from "./WhoIsThatPokemon";
import TypeEmojiBackground from "./TypeEmojiBackground";
import axios from "axios";
import "./App.css";
import "./Controls.css";
import "./Carousel.css";
import "./TypeColors.css";
import "./PokedexPage.css";
import "./PokeballTransition.css";
import "./TypeEmojiBackground.css";
import "./WhoIsThatPokemon.css";
import "./TypeEffectiveness.css";

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [allPokemons, setAllPokemons] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [isOpeningModal, setIsOpeningModal] = useState(false);
  const [pokemonToOpen, setPokemonToOpen] = useState(null);
  const [sortOrder] = useState("id");
  const [animationDirection, setAnimationDirection] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("pokedex-dark-mode") === "true"
  );
  const [favorites, setFavorites] = useState(
    () => new Set(JSON.parse(localStorage.getItem("pokemon-favorites") || "[]"))
  );
  const [showFavorites, setShowFavorites] = useState(false);
  const [showMinigame, setShowMinigame] = useState(false);
  const pokemonsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`https://pokeapi.co/api/v2/pokemon?limit=200`),
      axios.get(`https://pokeapi.co/api/v2/type`),
    ]).then(([pokemonsRes, typesRes]) => {
      const enrichedPokemons = pokemonsRes.data.results.map((p, index) => ({
        ...p,
        id: index + 1,
      }));
      setAllPokemons(enrichedPokemons);
      setPokemons(enrichedPokemons);
      const validTypes = typesRes.data.results.filter(
        (type) => type.name !== "unknown" && type.name !== "shadow"
      );
      setTypes(validTypes);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setPage(0);
  }, [search, selectedType]);

  useEffect(() => {
    if (!selectedType) {
      setPokemons(allPokemons);
      return;
    }
    setLoading(true);
    axios.get(`https://pokeapi.co/api/v2/type/${selectedType}`).then((res) => {
      const typedPokemons = res.data.pokemon.map((p) => {
        const id = +p.pokemon.url.split("/").filter(Boolean).pop();
        return {
          ...p.pokemon,
          id,
        };
      });
      setPokemons(typedPokemons);
      setLoading(false);
    });
  }, [selectedType, allPokemons]);

  useEffect(() => {
    const bodyClasses = document.body.classList;
    for (const cls of [...bodyClasses]) {
      if (cls.startsWith("background-type-")) {
        bodyClasses.remove(cls);
      }
    }

    if (selectedType) {
      document.body.classList.add(`background-type-${selectedType}`);
    }
  }, [selectedType]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("pokedex-dark-mode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const saved = localStorage.getItem("pokemon-favorites");
    if (saved) {
      setFavorites(new Set(JSON.parse(saved)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("pokemon-favorites", JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFavorite = (pokemonId) => {
    setFavorites((prev) => {
      const newFav = new Set(prev);
      if (newFav.has(pokemonId)) {
        newFav.delete(pokemonId);
      } else {
        newFav.add(pokemonId);
      }
      return newFav;
    });
  };

  const sortedPokemons = [...allPokemons].sort((a, b) => {
    if (sortOrder === "name") {
      return a.name.localeCompare(b.name);
    }
    return a.id - b.id;
  });

  const filteredPokemons = (selectedType ? pokemons : sortedPokemons).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (!showFavorites || favorites.has(p.id))
  );

  const paginatedPokemons = filteredPokemons.slice(
    page * pokemonsPerPage,
    (page + 1) * pokemonsPerPage
  );
  const totalPages = Math.ceil(filteredPokemons.length / pokemonsPerPage);

  const handlePokemonSelect = (pokemonName) => {
    setPokemonToOpen(pokemonName);
    setIsOpeningModal(true);
  };

  const handleSwitchPokemon = (pokemonName) => {
    setSelectedPokemon(null);
    setTimeout(() => handlePokemonSelect(pokemonName), 50);
  };

  const handlePageChange = (newPage) => {
    if (newPage > page) {
      setAnimationDirection("slide-out-left");
    } else {
      setAnimationDirection("slide-out-right");
    }

    setTimeout(() => {
      setPage(newPage);
      if (newPage > page) {
        setAnimationDirection("slide-in-right");
      } else {
        setAnimationDirection("slide-in-left");
      }
    }, 250);
  };

  return (
    <div className="main-layout">
      <TypeEmojiBackground />
      <h1 className="main-title">Pokédex</h1>
      <div className="header-box">
        <div className="type-filters">
          <button
            className={`type-filter ${
              !selectedType && !showFavorites ? "active" : ""
            }`}
            onClick={() => {
              setSelectedType(null);
              setShowFavorites(false);
            }}
          >
            All
          </button>
          <button
            className={`type-filter ${showFavorites ? "active" : ""}`}
            onClick={() => {
              setShowFavorites(!showFavorites);
              setSelectedType(null);
            }}
          >
            Favorites
          </button>
          {types.map((type) => (
            <button
              key={type.name}
              className={`type-filter type-${type.name} ${
                selectedType === type.name ? "active" : ""
              }`}
              onClick={() => {
                setSelectedType(type.name);
                setShowFavorites(false);
              }}
            >
              {type.name}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="search-input"
          placeholder="Search Pokémon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="theme-toggle-btn"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
        <button className="minigame-btn" onClick={() => setShowMinigame(true)}>
          🎮 Minigame
        </button>
      </div>
      <div className="carousel-section">
        {loading ? (
          <div className="loader-container">
            <div className="pokeball-loader"></div>
          </div>
        ) : (
          <div className="pokemon-carousel-container">
            <button
              className="carousel-arrow prev"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
            >
              &#9664;
            </button>
            <div className="pokemon-carousel">
              <ul className={animationDirection}>
                {paginatedPokemons.map((pokemon) => (
                  <li key={pokemon.name}>
                    <button
                      className="pokemon-btn"
                      onClick={() => handlePokemonSelect(pokemon.name)}
                    >
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                        alt={pokemon.name}
                        width="40"
                        height="40"
                      />
                      {pokemon.name}
                    </button>
                    <button
                      className="favorite-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(pokemon.id);
                      }}
                    >
                      {favorites.has(pokemon.id) ? "❤️" : "🤍"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="carousel-arrow next"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1}
            >
              &#9654;
            </button>
          </div>
        )}
      </div>
      {isOpeningModal && (
        <PokeballTransition
          onAnimationEnd={() => {
            setSelectedPokemon(pokemonToOpen);
            setIsOpeningModal(false);
          }}
        />
      )}
      {selectedPokemon && (
        <PokemonModal
          name={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          onPokemonSelect={handleSwitchPokemon}
        />
      )}
      {showMinigame && (
        <WhoIsThatPokemon
          allPokemons={allPokemons}
          onClose={() => setShowMinigame(false)}
        />
      )}
    </div>
  );
}
