import React, { useEffect, useState } from "react";
import axios from "axios";

const PAGE_SIZE = 10;

export default function PokemonList({ onSelect }) {
  const [pokemons, setPokemons] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=1302&offset=0`)
      .then((res) => {
        const sorted = res.data.results.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setPokemons(sorted);
        setCount(sorted.length);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert("Error al cargar los pokemones");
      });
  }, []);

  const totalPages = Math.ceil(count / PAGE_SIZE);
  const paginatedPokemons = pokemons.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {paginatedPokemons.map((p) => (
            <li key={p.name}>
              <button className="pokemon-btn" onClick={() => onSelect(p.name)}>
                {p.name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Anterior
        </button>
        <span>
          {" "}
          Página {page} de {totalPages}{" "}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
