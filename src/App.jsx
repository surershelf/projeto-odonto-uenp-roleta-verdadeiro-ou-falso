import React, { useState, useEffect } from "react";
import PlayerRegistration from "./components/PlayerRegistration";
import GameScreen from "./components/GameScreen";
import RankingScreen from "./components/RankingScreen";
import "./App.css";
import uenpImg from "./assets/UENP.png";
import { addScore, subscribeToScores } from "./services/score";

function App() {
  const [gameState, setGameState] = useState("registration"); // 'registration', 'playing', 'ranking'
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [players, setPlayers] = useState([]);

  // Escuta o ranking do Firestore em tempo real
  useEffect(() => {
    const unsubscribe = subscribeToScores((list) => setPlayers(list));
    return () => unsubscribe();
  }, []);

  const handlePlayerRegistration = (playerData) => {
    // Guarda só o nome (id e score serão definidos ao salvar)
    setCurrentPlayer({ name: playerData.name });
    setGameState("playing");
  };

  const handleGameComplete = async (finalScore) => {
    // Salva no Firestore e obtém o ID do documento criado
    const { id } = await addScore({ name: currentPlayer.name, score: finalScore });

    // Mantém um "espelho" local só para destacar no ranking
    const completedPlayer = {
      id,
      name: currentPlayer.name,
      score: finalScore,
      completedAt: new Date().toISOString(),
    };

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
        <img src={uenpImg} alt="Logo UENP" />
        <h1>ROLETA ODONTOLÓGICA</h1>
        <p>Teste seus conhecimentos em odontologia!</p>
      </header>

      <main className="game-container">{renderCurrentScreen()}</main>
    </div>
  );
}

export default App;
