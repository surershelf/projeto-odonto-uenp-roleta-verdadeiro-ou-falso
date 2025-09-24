import React, { useState } from "react";
import questions from "../data/questions";

const Roleta = ({
  onQuestionSelect,
  isSpinning,
  setIsSpinning,
  onSpinComplete,
}) => {
  const [rotation, setRotation] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState(null);

  // Cada segmento tem 24 graus (360 / 15 = 24)
  const segmentAngle = 360 / 15;

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedSegment(null);

    // Gera um número aleatório entre 1080 e 5040 graus (3 a 14 voltas completas)
    const minSpins = 3;
    const maxSpins = 14;
    const randomSpins = Math.random() * (maxSpins - minSpins) + minSpins;
    const finalRotation = randomSpins * 360;

    // Adiciona um ângulo aleatório para determinar onde vai parar
    const randomAngle = Math.random() * 360;
    const totalRotation = rotation + finalRotation + randomAngle;

    setRotation(totalRotation);

    // Calcula qual segmento foi selecionado
    setTimeout(() => {
      // A seta aponta para cima (0 graus), então calculamos onde ela parou
      // Invertemos a rotação porque a roleta gira no sentido horário
      // mas queremos saber onde a seta "fixa" está apontando
      const finalAngle = (360 - (totalRotation % 360)) % 360;

      // Cada segmento tem 24 graus, o primeiro segmento (pergunta 1) vai de 0 a 24 graus
      // Ajustamos para que o segmento 1 esteja no topo (onde a seta aponta)
      const segmentIndex = Math.floor(finalAngle / segmentAngle);
      const selectedQuestion = questions[segmentIndex];

      setSelectedSegment(segmentIndex);
      onQuestionSelect(selectedQuestion);
      onSpinComplete();
    }, 3000); // Duração da animação
  };

  const renderSegments = () => {
    return questions.map((question, index) => {
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

      // Cores alternadas para os segmentos
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

      return (
        <g key={index}>
          <path
            d={pathData}
            fill={colors[index]}
            stroke="#333"
            strokeWidth="2"
            className={`segment ${selectedSegment === index ? "selected" : ""}`}
          />
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#333"
            transform={`rotate(${textAngle}, ${textX}, ${textY})`}
          >
            {index + 1}
          </text>
        </g>
      );
    });
  };

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
        className={`spin-button ${isSpinning ? "spinning" : ""}`}
        onClick={spin}
        disabled={isSpinning}
      >
        {isSpinning ? "Girando..." : "GIRAR ROLETA"}
      </button>

      {/* Informações */}
      <div className="info-panel">
        <p>Clique no botão para girar a roleta e responder uma pergunta!</p>
        {selectedSegment !== null && !isSpinning && (
          <p className="selected-info">
            Você selecionou a pergunta número {selectedSegment + 1}!
          </p>
        )}
      </div>
    </div>
  );
};

export default Roleta;
