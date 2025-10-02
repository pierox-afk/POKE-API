import React, { useState } from "react";
import PokemonList from "./PokemonList";
import PokemonModal from "./PokemonModal";
import "./App.css";

function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="app-container">
      <h1>Pokemones</h1>
      <PokemonList onSelect={setSelected} />
      {selected && (
        <PokemonModal name={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default App;
