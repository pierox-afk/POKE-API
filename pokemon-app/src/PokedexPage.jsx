import React, { useState, useEffect } from "react";
import PokemonModal from "../../components/PokemonModal/PokemonModal.jsx";
import PokeballTransition from "../../components/PokeballTransition/PokeballTransition.jsx";
import axios from "axios";
import "./PokedexPage.css";
import "./Carousel.css";

export default function PokedexPage() {
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
  const pokemonsPerPage = 10;

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`https://pokeapi.co/api/v2/pokemon?limit=1302`),
      axios.get(`https://pokeapi.co/api/v2/type`),
    ]).then(([pokemonsRes, typesRes]) => {
      setAllPokemons(
        pokemonsRes.data.results.map((p, index) => ({ ...p, id: index + 1 }))
      );
      setPokemons(
        pokemonsRes.data.results.map((p, index) => ({ ...p, id: index + 1 }))
      );
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
        const id = p.pokemon.url.split("/").filter(Boolean).pop();
        return { ...p.pokemon, id: +id };
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

  const sortedPokemons = [...pokemons].sort((a, b) => {
    if (sortOrder === "name") {
      return a.name.localeCompare(b.name);
    }
    return a.id - b.id;
  });

  const filteredPokemons = sortedPokemons.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
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
  const handleEvolutionSelect = (pokemonName) => {
    setSelectedPokemon(null);
    handlePokemonSelect(pokemonName);
  };

  const handlePageChange = (direction) => {
    let newPage;
    if (direction === "next") {
      newPage = page >= totalPages - 1 ? 0 : page + 1;
      setAnimationDirection("slide-out-left");
    } else {
      newPage = page === 0 ? totalPages - 1 : page - 1;
      setAnimationDirection("slide-out-right");
    }

    setTimeout(() => {
      setPage(newPage);
      if (direction === "next") {
        setAnimationDirection("slide-in-right");
      } else {
        setAnimationDirection("slide-in-left");
      }
    }, 250);
  };

  return (
    <div className="main-layout">
      <h1 className="main-title">Pokédex</h1>
      <div className="header-box">
        <div className="type-filters">
          <button
            className={`type-filter ${!selectedType ? "active" : ""}`}
            onClick={() => setSelectedType(null)}
          >
            All
          </button>
          {types.map((type) => (
            <button
              key={type.name}
              className={`type-filter type-${type.name} ${
                selectedType === type.name ? "active" : ""
              }`}
              onClick={() => setSelectedType(type.name)}
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
              onClick={() => handlePageChange("prev")}
              disabled={totalPages <= 1}
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
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="carousel-arrow next"
              onClick={() => handlePageChange("next")}
              disabled={totalPages <= 1}
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
          onPokemonSelect={handleEvolutionSelect}
        />
      )}
    </div>
  );
}
