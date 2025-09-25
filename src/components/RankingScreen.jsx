import React from "react";

const RankingScreen = ({ players, currentPlayer, onPlayAgain }) => {
  // Ordena os jogadores por pontuação (maior para menor) e depois por data
  const sortedPlayers = [...players].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(a.completedAt) - new Date(b.completedAt);
  });

  const getRankingPosition = (playerId) => {
    return sortedPlayers.findIndex((p) => p.id === playerId) + 1;
  };

  const getMedalIcon = (position) => {
    switch (position) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "🏅";
    }
  };

  const getScorePercentage = (score) => {
    return (score / 100) * 100; // 100 pontos é o máximo (10 perguntas x 10 pontos)
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getGenderIcon = (gender) => {
    switch (gender) {
      case "feminino":
        return "♀️";
      case "masculino":
        return "♂️";
      case "outro":
        return "⚧️";
      default:
        return "👤";
    }
  };

  const averageScore =
    players.length > 0
      ? Math.round(
          players.reduce((sum, player) => sum + player.score, 0) /
            players.length
        )
      : 0;

  const maxScore = Math.max(...players.map((p) => p.score), 0);

  return (
    <div className="ranking-screen">
      <div className="ranking-header">
        <h2>🏆 Ranking Global</h2>
        <p>Veja como você se saiu em relação aos outros jogadores!</p>
      </div>

      {currentPlayer && (
        <div className="player-result">
          <div className="result-card highlight">
            <div className="result-header">
              <div className="medal-icon">
                {getMedalIcon(getRankingPosition(currentPlayer.id))}
              </div>
              <div className="result-info">
                <h3>Seu Resultado</h3>
                <p className="position">
                  #{getRankingPosition(currentPlayer.id)} lugar
                </p>
              </div>
            </div>
            <div className="result-details">
              <div className="score-display">
                <span className="score-number">{currentPlayer.score}</span>
                <span className="score-label">pontos</span>
              </div>
              <div className="score-bar">
                <div
                  className="score-fill"
                  style={{
                    width: `${getScorePercentage(currentPlayer.score)}%`,
                  }}
                ></div>
              </div>
              <p className="score-percentage">
                {getScorePercentage(currentPlayer.score)}% de aproveitamento
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="ranking-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{players.length}</span>
            <span className="stat-label">Jogadores</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{averageScore}</span>
            <span className="stat-label">Média de Pontos</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{maxScore}</span>
            <span className="stat-label">Recorde</span>
          </div>
        </div>
      </div>

      <div className="ranking-list">
        <h3>📊 Lista de Jogadores</h3>
        <div className="ranking-table">
          <div className="table-header">
            <div className="col-position">#</div>
            <div className="col-player">Jogador</div>
            <div className="col-score">Pontos</div>
            <div className="col-date">Data</div>
          </div>

          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`table-row ${
                currentPlayer && player.id === currentPlayer.id
                  ? "current-player"
                  : ""
              }`}
            >
              <div className="col-position">
                <span className="position-medal">
                  {getMedalIcon(index + 1)}
                </span>
                <span className="position-number">#{index + 1}</span>
              </div>
              <div className="col-player">
                <div className="player-info">
                  <span className="player-name">{player.name}</span>
                  <span className="player-details">
                    {getGenderIcon(player.gender)} {player.age} anos
                  </span>
                </div>
              </div>
              <div className="col-score">
                <span className="score-points">{player.score} pts</span>
                <div className="mini-bar">
                  <div
                    className="mini-fill"
                    style={{ width: `${getScorePercentage(player.score)}%` }}
                  ></div>
                </div>
              </div>
              <div className="col-date">
                <span className="date-text">
                  {formatDate(player.completedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {players.length === 0 && (
          <div className="empty-ranking">
            <div className="empty-icon">📈</div>
            <h3>Ranking Vazio</h3>
            <p>Seja o primeiro a jogar e apareça no ranking!</p>
          </div>
        )}
      </div>

      <div className="ranking-actions">
        <button onClick={onPlayAgain} className="play-again-button">
          <span className="button-icon">🔄</span>
          Jogar Novamente
        </button>
      </div>
    </div>
  );
};

export default RankingScreen;
