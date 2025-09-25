import React, { useState } from "react";

const PlayerRegistration = ({ onPlayerRegistered, onViewRanking }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpa o erro do campo quando o usuário começa a digitar
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

    if (!formData.age) {
      newErrors.age = "Idade é obrigatória";
    } else if (formData.age < 1 || formData.age > 120) {
      newErrors.age = "Idade deve ser entre 1 e 120 anos";
    }

    if (!formData.gender) {
      newErrors.gender = "Selecione o sexo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onPlayerRegistered({
        name: formData.name.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
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

          <div className="form-group">
            <label htmlFor="age">Idade</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Digite sua idade"
              min="1"
              max="120"
              className={errors.age ? "error" : ""}
            />
            {errors.age && <span className="error-message">{errors.age}</span>}
          </div>

          <div className="form-group">
            <label>Sexo</label>
            <div className="gender-options">
              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="feminino"
                  checked={formData.gender === "feminino"}
                  onChange={handleInputChange}
                />
                <span className="gender-label">
                  <span className="gender-icon">♀️</span>
                  Feminino
                </span>
              </label>

              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="masculino"
                  checked={formData.gender === "masculino"}
                  onChange={handleInputChange}
                />
                <span className="gender-label">
                  <span className="gender-icon">♂️</span>
                  Masculino
                </span>
              </label>

              <label className="gender-option">
                <input
                  type="radio"
                  name="gender"
                  value="outro"
                  checked={formData.gender === "outro"}
                  onChange={handleInputChange}
                />
                <span className="gender-label">
                  <span className="gender-icon">⚧️</span>
                  Outro
                </span>
              </label>
            </div>
            {errors.gender && (
              <span className="error-message">{errors.gender}</span>
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
