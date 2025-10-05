import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const typeColors = {
  normal: "168, 167, 122",
  fire: "238, 129, 48",
  water: "99, 144, 240",
  electric: "247, 208, 44",
  grass: "122, 199, 76",
  ice: "150, 217, 214",
  fighting: "194, 46, 40",
  poison: "163, 62, 161",
  ground: "226, 191, 101",
  flying: "169, 143, 243",
  psychic: "249, 85, 135",
  bug: "166, 185, 26",
  rock: "182, 161, 54",
  ghost: "115, 87, 151",
  dragon: "111, 53, 252",
  dark: "112, 87, 70",
  steel: "183, 183, 206",
  fairy: "214, 133, 173",
};

const StatsRadarChart = ({ stats, type }) => {
  const chartColor = typeColors[type] || typeColors.normal;

  const data = {
    labels: stats.map((stat) =>
      stat.stat.name.replace("special-", "sp-").toUpperCase()
    ),
    datasets: [
      {
        label: "Base Stats",
        data: stats.map((stat) => stat.base_stat),
        backgroundColor: `rgba(${chartColor}, 0.4)`,
        borderColor: `rgba(${chartColor}, 1)`,
        borderWidth: 2,
        pointBackgroundColor: `rgba(${chartColor}, 1)`,
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: `rgba(${chartColor}, 1)`,
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          color: "rgba(45, 45, 45, 0.2)",
        },
        grid: {
          color: "rgba(45, 45, 45, 0.2)",
        },
        pointLabels: {
          font: {
            size: 12,
            family: "'Press Start 2P', 'Arial', sans-serif",
          },
          color: "#2d2d2d",
        },
        ticks: {
          backdropColor: "rgba(255, 251, 235, 0.8)",
          color: "#3b4cca",
          stepSize: 50,
        },
        suggestedMin: 0,
        suggestedMax: 150,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return <Radar data={data} options={options} />;
};

export default StatsRadarChart;
