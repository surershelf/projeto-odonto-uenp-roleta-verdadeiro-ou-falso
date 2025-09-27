import React, { useState } from "react";

const PlayerRegistration = ({ onPlayerRegistered, onViewRanking }) => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onPlayerRegistered({
        name: formData.name.trim(),
      });
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-header">
          <div className="registration-icon">👤</div>
          <h2>Cadastro do Jogador</h2>
          <p>Registre-se para começar a jogar!</p>
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="name">Nome Completo</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Digite seu nome completo"
              className={errors.name ? "error" : ""}
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <button type="submit" className="start-game-button">
            <span className="button-icon">🎮</span>
            Começar Jogo
          </button>
        </form>

        {onViewRanking && (
          <div className="ranking-section">
            <button onClick={onViewRanking} className="view-ranking-button">
              <span className="button-icon">🏆</span>
              Ver Ranking
            </button>
          </div>
        )}
      </div>

      <div className="game-info">
        <h3>📋 Como Jogar</h3>
        <ul>
          <li>🎯 Responda 10 perguntas sobre odontologia</li>
          <li>⚡ Cada acerto vale 10 pontos</li>
          <li>🔄 As perguntas não se repetem</li>
          <li>🏆 Sua pontuação vai para o ranking global</li>
        </ul>
      </div>
    </div>
  );
};

export default PlayerRegistration;
