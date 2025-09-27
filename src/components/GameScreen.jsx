import React, { useState, useEffect } from "react";
import Roleta from "./Roleta";
import QuestionModal from "./QuestionModal";
import questions from "../data/questions";

const GameScreen = ({ player, onGameComplete }) => {
  const [currentRound, setCurrentRound] = useState(10);
  const [score, setScore] = useState(0);
  const [gameQuestions, setGameQuestions] = useState([...questions]); // Cópia local das perguntas
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const totalRounds = 10;

  // Reset das perguntas quando o jogo inicia
  useEffect(() => {
    const resetQuestions = questions.map((q) => ({ ...q, used: false }));
    setGameQuestions(resetQuestions);
  }, []);

  useEffect(() => {
    if (currentRound > totalRounds && !gameComplete) {
      setGameComplete(true);
      onGameComplete(score);
    }
  }, [currentRound, score, totalRounds, gameComplete, onGameComplete]);

  const handleQuestionSelect = (question) => {
    setCurrentQuestion(question);
    setShowModal(true);
  };

  const handleAnswerSubmit = (isCorrect) => {
    if (isCorrect) {
      setScore((prev) => prev + 10);
    }

    // Marca a pergunta como usada
    setGameQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === currentQuestion.id ? { ...q, used: true } : q
      )
    );
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentQuestion(null);

    // Próxima rodada
    setCurrentRound((prev) => prev + 1);
  };

  const handleSpinComplete = () => {
    setIsSpinning(false);
  };

  // Conta perguntas disponíveis (não usadas)
  const availableQuestionsCount = gameQuestions.filter((q) => !q.used).length;

  if (gameComplete) {
    return (
      <div className="game-complete">
        <div className="complete-card">
          <h2>🎉 Jogo Finalizado!</h2>
          <p>Aguarde... Calculando sua pontuação final...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-screen">
      <div className="game-header">
        <div className="player-info">
          <h2>👋 Olá, {player.name}!</h2>
        </div>
      </div>

      <div className="game-status">
        <div className="status-card">
          <div className="status-item">
            <span className="status-label">Rodada</span>
            <span className="status-value">
              {currentRound}/{totalRounds}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Pontuação</span>
            <span className="status-value score">{score} pts</span>
          </div>
          <div className="status-item">
            <span className="status-label">Perguntas Restantes</span>
            <span className="status-value">{availableQuestionsCount}</span>
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentRound - 1) / totalRounds) * 100}%` }}
        ></div>
      </div>

      <Roleta
        gameQuestions={gameQuestions}
        onQuestionSelect={handleQuestionSelect}
        isSpinning={isSpinning}
        setIsSpinning={setIsSpinning}
        onSpinComplete={handleSpinComplete}
        currentRound={currentRound}
        disabled={currentRound > totalRounds}
      />

      {showModal && currentQuestion && (
        <QuestionModal
          question={currentQuestion}
          onClose={handleCloseModal}
          onAnswerSubmit={handleAnswerSubmit}
          roundNumber={currentRound - 1}
        />
      )}

      {currentRound > totalRounds && (
        <div className="round-complete">
          <p>Finalizando jogo...</p>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
