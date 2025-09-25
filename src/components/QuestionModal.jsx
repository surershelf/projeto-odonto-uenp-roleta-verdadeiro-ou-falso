import React, { useState } from "react";

const QuestionModal = ({ question, onClose, onAnswerSubmit, roundNumber }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswerSelect = (answer) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    const correct = answer === question.correct;
    setIsCorrect(correct);
    setShowResult(true);

    // Notifica o componente pai sobre a resposta
    onAnswerSubmit(correct);
  };

  const resetQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const handleClose = () => {
    resetQuestion();
    onClose();
  };

  const handleNextQuestion = () => {
    resetQuestion();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Rodada {roundNumber + 1}</h2>
          <button className="close-button" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="question-container">
            <h3>Questão {question.id}</h3>
            <p className="question-text">{question.question}</p>
          </div>

          <div className="answers-container">
            <button
              className={`answer-button ${
                selectedAnswer === true
                  ? showResult
                    ? isCorrect
                      ? "correct"
                      : "incorrect"
                    : "selected"
                  : showResult && question.correct === true
                  ? "correct-answer"
                  : ""
              }`}
              onClick={() => handleAnswerSelect(true)}
              disabled={showResult}
            >
              ✅ VERDADEIRO
            </button>

            <button
              className={`answer-button ${
                selectedAnswer === false
                  ? showResult
                    ? isCorrect
                      ? "correct"
                      : "incorrect"
                    : "selected"
                  : showResult && question.correct === false
                  ? "correct-answer"
                  : ""
              }`}
              onClick={() => handleAnswerSelect(false)}
              disabled={showResult}
            >
              ❌ FALSO
            </button>
          </div>

          {showResult && (
            <div
              className={`result-container ${
                isCorrect ? "correct-result" : "incorrect-result"
              }`}
            >
              <div className="result-icon">{isCorrect ? "🎉" : "😔"}</div>
              <h4>
                {isCorrect
                  ? "Parabéns! Resposta Correta! (+10 pts)"
                  : "Ops! Resposta Incorreta! (0 pts)"}
              </h4>
              <p className="explanation">
                <strong>Explicação:</strong> {question.explanation}
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!showResult ? (
            <p className="instruction">Selecione Verdadeiro ou Falso</p>
          ) : (
            <button className="next-button" onClick={handleNextQuestion}>
              Próxima Rodada
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;
