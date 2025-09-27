import React, { useState, useEffect } from "react";
import PlayerRegistration from "./components/PlayerRegistration";
import GameScreen from "./components/GameScreen";
import RankingScreen from "./components/RankingScreen";
import "./App.css";
import uenpImg from "./assets/UENP.png";

function App() {
  const [gameState, setGameState] = useState("registration"); // 'registration', 'playing', 'ranking'
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [players, setPlayers] = useState([]);

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const savedPlayers = localStorage.getItem("odontoGamePlayers");
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
  }, []);

  // Salvar dados no localStorage sempre que players mudar
  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem("odontoGamePlayers", JSON.stringify(players));
    }
  }, [players]);

  const handlePlayerRegistration = (playerData) => {
    const newPlayer = {
      ...playerData,
      id: Date.now(),
      score: 0,
      completedAt: null,
    };
    setCurrentPlayer(newPlayer);
    setGameState("playing");
  };

  const handleGameComplete = (finalScore) => {
    const completedPlayer = {
      ...currentPlayer,
      score: finalScore,
      completedAt: new Date().toISOString(),
    };

    setPlayers((prevPlayers) => [...prevPlayers, completedPlayer]);
    setCurrentPlayer(completedPlayer);
    setGameState("ranking");
  };

  const handlePlayAgain = () => {
    setCurrentPlayer(null);
    setGameState("registration");
  };

  const handleViewRanking = () => {
    setGameState("ranking");
  };

  const renderCurrentScreen = () => {
    switch (gameState) {
      case "registration":
        return (
          <PlayerRegistration
            onPlayerRegistered={handlePlayerRegistration}
            onViewRanking={players.length > 0 ? handleViewRanking : null}
          />
        );
      case "playing":
        return (
          <GameScreen
            player={currentPlayer}
            onGameComplete={handleGameComplete}
          />
        );
      case "ranking":
        return (
          <RankingScreen
            players={players}
            currentPlayer={currentPlayer}
            onPlayAgain={handlePlayAgain}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <img src={uenpImg} alt="Logo UENP"/>
        <h1> ROLETA ODONTOLÓGICA</h1>
        <p>Teste seus conhecimentos em odontologia!</p>
      </header>

      <main className="game-container">{renderCurrentScreen()}</main>
    </div>
  );
}

export default App;
