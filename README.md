# Interactive Pokédex with React

A modern and fully interactive web application for exploring the world of Pokémon. Built with React and Vite, this Pokédex offers a fluid and feature-rich user experience, consuming data from the [PokeAPI](https://pokeapi.co/).


## ✨ Key Features

This application goes beyond a simple list, offering a complete suite of tools for Pokémon enthusiasts.

### 1. Advanced Navigation and Search
- **Search by Name**: Quickly find any Pokémon by typing its name.
- **Filter by Type**: Filter the list to see only Pokémon of one or more specific types. The page background dynamically changes to match the selected type's color.
- **Paginated Carousel**: Browse through Pokémon with an animated and easy-to-use carousel.

<img width="1869" height="949" alt="image" src="https://github.com/user-attachments/assets/2fe1b9d9-4c5f-43f4-9cbe-2860b1302f91" />



### 2. Detailed Pokémon Modal
When a Pokémon is selected, a modal opens with comprehensive information:
- **Base Stats**: View stats (HP, Attack, Defense, etc.) on an intuitive **radar chart**.
- **Evolution Chain**: See the complete evolutionary line and navigate between evolutions with a single click.
- **Type Effectiveness**: Discover the Pokémon's weaknesses, resistances, and immunities.
- **Shiny Variants**: Toggle between the normal and shiny versions of the Pokémon.

<img width="532" height="944" alt="image" src="https://github.com/user-attachments/assets/6ba245cf-eb05-42a3-b1d1-356334d2bfd5" />
<img width="483" height="509" alt="image" src="https://github.com/user-attachments/assets/85d45f6d-2423-4cf3-978f-676a14d0db7b" />


### 3. Favorites and Theme System
- **Favorites**: Mark your favorite Pokémon and filter them to see your personal collection. Favorites are saved locally in your browser.
- **Dark/Light Mode**: Switch between a light and dark theme for a better viewing experience based on your preference.

### 4. Mini-Game: Who's That Pokémon?
Test your knowledge with the classic mini-game! Guess the Pokémon from its silhouette and compete for the highest score.

<img width="1206" height="880" alt="image" src="https://github.com/user-attachments/assets/8d379424-ce7f-4d62-9e1b-dcf3dd377ce7" />


### 5. Responsive Design
The interface is designed to be fully functional and aesthetically pleasing on any device, from desktops to mobile phones.

---

## 🛠️ Technologies Used

- **[React](https://reactjs.org/)**: The main library for building the user interface.
- **[Vite](https://vitejs.dev/)**: Next-generation front-end tooling for development and bundling.
- **[Axios](https://axios-http.com/)**: HTTP client for making requests to the PokeAPI.
- **[Chart.js](https://www.chartjs.org/)** & **[react-chartjs-2](https://react-chartjs-2.js.org/)**: For creating the stats radar chart.
- **Modern CSS**: Custom styles with animations, transitions, and a responsive design using Flexbox and Grid Layout.

### API
- **[PokeAPI](https://pokeapi.co/)**: The source of all Pokémon data.

---

## 🚀 Installation and Setup

Follow these steps to run the project on your local machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18 or higher) installed.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
