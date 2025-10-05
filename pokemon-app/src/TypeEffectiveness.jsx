import React from "react";
import "./TypeEffectiveness.css";

const TypeEffectiveness = ({ relations }) => {
  if (!relations) return null;

  const { weaknesses, resistances, immunities } = relations;

  const renderTypes = (types, label) => (
    <div className={`effectiveness-section section-${label.toLowerCase()}`}>
      <h4>{label}</h4>
      <div className="types-list">
        {types.length > 0 ? (
          types.map(({ name, multiplier }) => (
            <span key={name} className={`type-badge type-${name}`}>
              {name}
              {multiplier !== 1 && (
                <span className="multiplier-badge">x{multiplier}</span>
              )}
            </span>
          ))
        ) : (
          <span className="no-effect">None</span>
        )}
      </div>
    </div>
  );

  return (
    <div className="type-effectiveness-container">
      <h3>Type Effectiveness</h3>
      <div className="effectiveness-grid">
        {renderTypes(weaknesses, "Weaknesses")}
        {renderTypes(resistances, "Resistances")}
        {renderTypes(immunities, "Immunities")}
      </div>
    </div>
  );
};

export default TypeEffectiveness;
