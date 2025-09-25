import React, { useState } from "react";

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

  // Cada segmento tem 24 graus (360 / 15 = 24)
  const segmentAngle = 360 / 15;

  const spin = () => {
    // Só permite girar se há perguntas disponíveis
    const availableQuestions = gameQuestions.filter((q) => !q.used);

    if (isSpinning || disabled || availableQuestions.length === 0) return;

    setIsSpinning(true);
    setSelectedSegment(null);

    // Gera rotação aleatória (3 a 7 voltas completas)
    const minSpins = 3;
    const maxSpins = 7;
    const randomSpins = Math.random() * (maxSpins - minSpins) + minSpins;
    const fullRotations = randomSpins * 360;

    // Adiciona ângulo aleatório para onde vai parar
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + fullRotations + randomAngle;

    setRotation(totalRotation);

    // Calcula qual segmento foi selecionado após parar
    setTimeout(() => {
      // A seta aponta para o topo (0°), então calculamos onde a roleta parou
      // Normalizamos o ângulo final
      const finalAngle = (360 - (totalRotation % 360) + 360) % 360;

      // Determina qual segmento a seta está apontando
      const segmentIndex = Math.floor(finalAngle / segmentAngle) % 15;

      // Mapeia segmento para pergunta (segmento 0 = pergunta 1, etc.)
      const questionId = segmentIndex + 1;

      // Procura a pergunta correspondente ao segmento
      let selectedQuestion = gameQuestions.find((q) => q.id === questionId);

      // Se a pergunta do segmento já foi usada, seleciona uma disponível aleatória
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
    }, 3000); // Duração da animação
  };

  const renderSegments = () => {
    return Array.from({ length: 15 }, (_, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;

      // Calcula as coordenadas do segmento
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

      // Posição do texto
      const textAngle = startAngle + segmentAngle / 2;
      const textRadius = 120;
      const textX =
        200 + textRadius * Math.cos(((textAngle - 90) * Math.PI) / 180);
      const textY =
        200 + textRadius * Math.sin(((textAngle - 90) * Math.PI) / 180);

      // Verifica se a pergunta correspondente a este segmento foi usada
      const questionId = index + 1;
      const correspondingQuestion = gameQuestions.find(
        (q) => q.id === questionId
      );
      const isUsed = correspondingQuestion?.used || false;

      // Cores dos segmentos - cinza se usada, colorida se disponível
      const colors = [
        "#FF6B6B",
        "#4ECDC4",
        "#45B7D1",
        "#96CEB4",
        "#FFEAA7",
        "#DDA0DD",
        "#98D8C8",
        "#F06292",
        "#AED581",
        "#FFB74D",
        "#9FA8DA",
        "#FFCC80",
        "#80CBC4",
        "#CE93D8",
        "#90CAF9",
      ];

      const segmentColor = isUsed ? "#CCCCCC" : colors[index];

      return (
        <g key={index}>
          <path
            d={pathData}
            fill={segmentColor}
            stroke="#333"
            strokeWidth="2"
            className={`segment ${
              selectedSegment === index ? "selected" : ""
            } ${isUsed ? "used" : ""}`}
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
      <div className="roleta-wrapper">
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
          {/* Círculo externo da roleta */}
          <circle
            cx="200"
            cy="200"
            r="190"
            fill="none"
            stroke="#333"
            strokeWidth="4"
          />

          {/* Segmentos da roleta */}
          {renderSegments()}

          {/* Centro da roleta com logo */}
          <circle
            cx="200"
            cy="200"
            r="60"
            fill="#fff"
            stroke="#333"
            strokeWidth="3"
          />

          {/* Emoji no centro (lugar da logo) */}
          <text x="200" y="210" textAnchor="middle" fontSize="40">
            🦷
          </text>
        </svg>

        {/* Ponteiro fixo */}
        <div className="ponteiro">
          <svg width="40" height="60">
            <polygon
              points="20,50 35,10 5,10"
              fill="#1565c0"
              stroke="#fff"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Botão para girar */}
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

      {/* Informações */}
      <div className="info-panel">
        {!disabled ? (
          <>
            <p>Clique no botão para girar a roleta e responder uma pergunta!</p>
            <p className="round-info">
              Rodada {currentRound} - {availableQuestions.length} perguntas
              disponíveis
            </p>
          </>
        ) : (
          <p>Todas as rodadas foram completadas!</p>
        )}
        {selectedSegment !== null && !isSpinning && (
          <p className="selected-info">
            A roleta parou no segmento {selectedSegment + 1}!
          </p>
        )}
      </div>
    </div>
  );
};

export default Roleta;
