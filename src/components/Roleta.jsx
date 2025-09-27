import React, { useState } from "react";
import projetoImg from "../assets/logoProjetoKam1.png"

const Roleta = ({
  gameQuestions,
  onQuestionSelect,
  isSpinning,
  setIsSpinning,
  onSpinComplete,
  currentRound,
  disabled,
}) => {
  const [rotation, setRotation] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState(null);

  const segmentAngle = 360 / 15;

  const spin = () => {
    const availableQuestions = gameQuestions.filter((q) => !q.used);
    if (isSpinning || disabled || availableQuestions.length === 0) return;

    setIsSpinning(true);
    setSelectedSegment(null);

    const minSpins = 3;
    const maxSpins = 7;
    const randomSpins = Math.random() * (maxSpins - minSpins) + minSpins;
    const fullRotations = randomSpins * 360;
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + fullRotations + randomAngle;

    setRotation(totalRotation);

    setTimeout(() => {
      const finalAngle = (360 - (totalRotation % 360) + 360) % 360;
      const segmentIndex = Math.floor(finalAngle / segmentAngle) % 15;
      const questionId = segmentIndex + 1;

      let selectedQuestion = gameQuestions.find((q) => q.id === questionId);
      if (!selectedQuestion || selectedQuestion.used) {
        const availableQuestions = gameQuestions.filter((q) => !q.used);
        if (availableQuestions.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * availableQuestions.length
          );
          selectedQuestion = availableQuestions[randomIndex];
        }
      }

      setSelectedSegment(segmentIndex);
      if (selectedQuestion) {
        onQuestionSelect(selectedQuestion);
      }
      onSpinComplete();
    }, 3000);
  };

  const renderSegments = () => {
    return Array.from({ length: 15 }, (_, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      const largeArcFlag = segmentAngle > 180 ? 1 : 0;

      const x1 = 200 + 180 * Math.cos(((startAngle - 90) * Math.PI) / 180);
      const y1 = 200 + 180 * Math.sin(((startAngle - 90) * Math.PI) / 180);
      const x2 = 200 + 180 * Math.cos(((endAngle - 90) * Math.PI) / 180);
      const y2 = 200 + 180 * Math.sin(((endAngle - 90) * Math.PI) / 180);

      const pathData = [
        `M 200 200`,
        `L ${x1} ${y1}`,
        `A 180 180 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        "Z",
      ].join(" ");

      const textAngle = startAngle + segmentAngle / 2;
      const textRadius = 120;
      const textX = 200 + textRadius * Math.cos(((textAngle - 90) * Math.PI) / 180);
      const textY = 200 + textRadius * Math.sin(((textAngle - 90) * Math.PI) / 180);

      const questionId = index + 1;
      const correspondingQuestion = gameQuestions.find((q) => q.id === questionId);
      const isUsed = correspondingQuestion?.used || false;

      const colors = [
        "#6a3da4","#8d68b8","#b03da2","#c366b7","#ed3a9e",
        "#f3161f","#f76f1b","#fa961a","#ffcf0d","#fef500",
        "#93fd05","#adfe33","#00b396","#009ada","#0150af",
      ];

      const segmentColor = isUsed ? "#CCCCCC" : colors[index];

      return (
        <g key={index}>
          <path
            d={pathData}
            fill={segmentColor}
            stroke="#333"
            strokeWidth="2"
            className={`segment ${selectedSegment === index ? "selected" : ""} ${isUsed ? "used" : ""}`}
            opacity={isUsed ? 0.5 : 1}
          />
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12"
            fontWeight="bold"
            fill={isUsed ? "#999" : "#333"}
            transform={`rotate(${textAngle}, ${textX}, ${textY})`}
          >
            {questionId}
          </text>
          {isUsed && (
            <text
              x={textX}
              y={textY + 15}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="16"
              fill="#999"
              transform={`rotate(${textAngle}, ${textX}, ${textY + 15})`}
            >
              ✓
            </text>
          )}
        </g>
      );
    });
  };

  const availableQuestions = gameQuestions.filter((q) => !q.used);

  return (
    <div className="roleta-container">
      <div className="roleta-wrapper" style={{ position: "relative" }}>
        <svg
          width="400"
          height="400"
          className="roleta-svg"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? "transform 3s cubic-bezier(0.23, 1, 0.320, 1)"
              : "none",
          }}
        >
          <circle cx="200" cy="200" r="190" fill="none" stroke="#333" strokeWidth="4" />
          {renderSegments()}
          <circle cx="200" cy="200" r="60" fill="#fff" stroke="#333" strokeWidth="3" />
        </svg>

        {/* Logo central posicionada em cima do círculo */}
        <img
          src={projetoImg}
          alt="Projeto Kam1"
          className="roleta-logo"
        />

        {/* Ponteiro fixo */}
        <div className="ponteiro">
          <svg width="40" height="60">
            <polygon points="20,50 35,10 5,10" fill="#1565c0" stroke="#fff" strokeWidth="2" />
          </svg>
        </div>
      </div>

      <button
        className={`spin-button ${isSpinning ? "spinning" : ""} ${
          disabled || availableQuestions.length === 0 ? "disabled" : ""
        }`}
        onClick={spin}
        disabled={isSpinning || disabled || availableQuestions.length === 0}
      >
        {isSpinning
          ? "Girando..."
          : disabled
          ? "Jogo Finalizado"
          : availableQuestions.length === 0
          ? "Sem Perguntas"
          : "GIRAR ROLETA"}
      </button>

      <div className="info-panel">
        {!disabled ? (
          <>
            <p>Clique no botão para girar a roleta e responder uma pergunta!</p>
            <p className="round-info">
              Rodada {currentRound} - {availableQuestions.length} perguntas disponíveis
            </p>
          </>
        ) : (
          <p>Todas as rodadas foram completadas!</p>
        )}
        {selectedSegment !== null && !isSpinning && (
          <p className="selected-info">A roleta parou no segmento {selectedSegment + 1}!</p>
        )}
      </div>
    </div>
  );
};

export default Roleta;
