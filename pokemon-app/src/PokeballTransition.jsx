import React, { useEffect } from "react";
import "./PokeballTransition.css";
import "./Animations.css";

const PokeballTransition = ({ onAnimationEnd }) => {
  useEffect(() => {
    const timer = setTimeout(onAnimationEnd, 1500);
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className="pokeball-transition-overlay">
      <div className="pokeball-animation"></div>
    </div>
  );
};

export default PokeballTransition;
