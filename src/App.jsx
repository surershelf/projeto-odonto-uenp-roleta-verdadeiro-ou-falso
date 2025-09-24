import React, { useState } from "react";
import Roleta from "./components/Roleta";
import QuestionModal from "./components/QuestionModal";
import "./App.css";

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleQuestionSelect = (question) => {
    setCurrentQuestion(question);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentQuestion(null);
  };

  const handleSpinComplete = () => {
    setIsSpinning(false);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🦷 Roleta Odontológica</h1>
        <p>Teste seus conhecimentos em odontologia!</p>
      </header>

      <main className="game-container">
        <Roleta
          onQuestionSelect={handleQuestionSelect}
          isSpinning={isSpinning}
          setIsSpinning={setIsSpinning}
          onSpinComplete={handleSpinComplete}
        />

        {showModal && currentQuestion && (
          <QuestionModal
            question={currentQuestion}
            onClose={handleCloseModal}
          />
        )}
      </main>
    </div>
  );
}

export default App;
