"use client"

import { useState, useEffect } from "react"

const FeedbackForm = () => {
  const [ratings, setRatings] = useState({})
  const [formData, setFormData] = useState({
    sessionDuration: "",
    wouldRecommend: "",
    wouldAttendAgain: "",
    strongestAspects: [],
    improvementAreas: [],
    overallComments: "",
    bestAspects: "",
    suggestions: "",
    additionalTopics: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [validationError, setValidationError] = useState("")

  // Styles CSS-in-JS
  const styles = {
    container: {
      fontFamily: '"Roboto", sans-serif',
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
      padding: "2rem 1rem",
    },
    card: {
      border: "none",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
      transition: "all 0.3s ease",
      overflow: "hidden",
      marginBottom: "2rem",
      backgroundColor: "white",
    },
    cardHeader: {
      borderBottom: "none",
      padding: "1.5rem",
      color: "white",
      fontWeight: "500",
    },
    cardHeaderPrimary: {
      background: "linear-gradient(135deg, #1976d2, #1565c0)",
    },
    cardHeaderSuccess: {
      background: "linear-gradient(135deg, #388e3c, #2e7d32)",
    },
    cardHeaderInfo: {
      background: "linear-gradient(135deg, #0288d1, #0277bd)",
    },
    cardHeaderWarning: {
      background: "linear-gradient(135deg, #f57c00, #ef6c00)",
      color: "#333",
    },
    cardHeaderSecondary: {
      background: "linear-gradient(135deg, #424242, #303030)",
    },
    cardHeaderDark: {
      background: "linear-gradient(135deg, #424242, #212121)",
    },
    cardBody: {
      padding: "1.5rem",
    },
    ratingGroup: {
      padding: "1rem",
      borderRadius: "8px",
      background: "rgba(0, 0, 0, 0.02)",
      border: "1px solid rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s ease",
      marginBottom: "1rem",
    },
    starRating: {
      display: "flex",
      gap: "4px",
      margin: "8px 0",
    },
    star: {
      fontSize: "2rem",
      color: "#e0e0e0",
      cursor: "pointer",
      transition: "all 0.2s ease",
      userSelect: "none",
    },
    starActive: {
      color: "#ffc107",
    },
    starHover: {
      color: "#ffb300",
    },
    textarea: {
      border: "2px solid #e0e0e0",
      borderRadius: "8px",
      padding: "12px 16px",
      fontSize: "1rem",
      transition: "all 0.3s ease",
      resize: "vertical",
      width: "100%",
      fontFamily: "inherit",
    },
    textareaFocus: {
      borderColor: "#1976d2",
      boxShadow: "0 0 0 0.2rem rgba(25, 118, 210, 0.25)",
      outline: "none",
    },
    button: {
      borderRadius: "8px",
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      padding: "12px 24px",
      fontSize: "1rem",
      border: "none",
      backgroundColor: "#1976d2",
      color: "white",
      cursor: "pointer",
    },
    successMessage: {
      background: "linear-gradient(135deg, #4caf50, #45a049)",
      color: "white",
      padding: "1rem",
      borderRadius: "8px",
      margin: "1rem 0",
      textAlign: "center",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    errorMessage: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      padding: "1rem",
      borderRadius: "8px",
      margin: "1rem 0",
      border: "1px solid #f5c6cb",
    },
    formCheck: {
      marginBottom: "0.75rem",
      padding: "0.5rem",
      borderRadius: "6px",
      transition: "background-color 0.2s ease",
    },
    formCheckInput: {
      marginRight: "0.5rem",
    },
    loadingSpinner: {
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "3px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "50%",
      borderTopColor: "#fff",
      animation: "spin 1s ease-in-out infinite",
    },
  }

  // CSS Animation keyframes
  useEffect(() => {
    const styleSheet = document.createElement("style")
    styleSheet.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      @media (max-width: 768px) {
        .star { font-size: 1.5rem !important; }
      }
    `
    document.head.appendChild(styleSheet)
    return () => document.head.removeChild(styleSheet)
  }, [])

  const StarRating = ({ rating, onRatingChange, label, description, ratingKey }) => {
    const [hoverRating, setHoverRating] = useState(0)

    return (
      <div style={styles.ratingGroup}>
        <label style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>{label}</label>
        {description && (
          <small style={{ color: "#666", display: "block", marginBottom: "0.5rem" }}>{description}</small>
        )}
        <div style={styles.starRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                ...styles.star,
                ...(star <= (hoverRating || rating) ? styles.starActive : {}),
                ...(hoverRating && star <= hoverRating ? styles.starHover : {}),
              }}
              onClick={() => onRatingChange(ratingKey, star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    )
  }

  const handleRatingChange = (ratingKey, value) => {
    setRatings((prev) => ({ ...prev, [ratingKey]: value }))
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field, value, checked) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? [...prev[field], value] : prev[field].filter((item) => item !== value),
    }))
  }

  const validateForm = () => {
    const requiredRatings = [
      "overallRating",
      "contentRelevance",
      "learningObjectives",
      "sessionStructure",
      "skillImprovement",
      "satisfactionLevel",
    ]

    const missingRatings = requiredRatings.filter((rating) => !ratings[rating])

    if (missingRatings.length > 0) {
      setValidationError("Veuillez compléter toutes les évaluations obligatoires.")
      return false
    }

    if (!formData.sessionDuration || !formData.wouldRecommend) {
      setValidationError("Veuillez répondre à toutes les questions obligatoires.")
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setValidationError("")

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const feedbackData = {
        ratings,
        ...formData,
        timestamp: new Date().toISOString(),
      }

      console.log("Feedback Data:", feedbackData)

      setShowSuccess(true)
      setIsSubmitting(false)

      // Reset form
      setRatings({})
      setFormData({
        sessionDuration: "",
        wouldRecommend: "",
        wouldAttendAgain: "",
        strongestAspects: [],
        improvementAreas: [],
        overallComments: "",
        bestAspects: "",
        suggestions: "",
        additionalTopics: "",
      })

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000)
    }, 2000)
  }

  const Card = ({ children, headerStyle, title, subtitle }) => (
    <div style={styles.card}>
      <div style={{ ...styles.cardHeader, ...headerStyle }}>
        <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{title}</h3>
        {subtitle && <p style={{ margin: "0.5rem 0 0 0", opacity: 0.75, fontSize: "0.9rem" }}>{subtitle}</p>}
      </div>
      <div style={styles.cardBody}>{children}</div>
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "1rem",
            }}
          >
            📚 Évaluation Complète de la Session
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#666" }}>
            Votre retour d'expérience nous aide à perfectionner nos programmes de formation
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div style={styles.successMessage}>
            ✅ Merci pour votre évaluation complète ! Votre feedback nous aidera à améliorer nos futures sessions de
            formation.
          </div>
        )}

        {/* Validation Error */}
        {validationError && <div style={styles.errorMessage}>⚠️ {validationError}</div>}

        <form onSubmit={handleSubmit}>
          {/* Évaluation Globale */}
          <Card
            headerStyle={styles.cardHeaderPrimary}
            title="⭐ Évaluation Globale de la Session"
            subtitle="Comment évaluez-vous l'ensemble de cette session de formation ?"
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
              <StarRating
                rating={ratings.overallRating || 0}
                onRatingChange={handleRatingChange}
                label="Note globale de la session"
                description="Évaluation générale de votre expérience"
                ratingKey="overallRating"
              />
              <StarRating
                rating={ratings.contentRelevance || 0}
                onRatingChange={handleRatingChange}
                label="Pertinence du contenu"
                description="Le contenu correspond-il à vos besoins ?"
                ratingKey="contentRelevance"
              />
              <StarRating
                rating={ratings.learningObjectives || 0}
                onRatingChange={handleRatingChange}
                label="Atteinte des objectifs"
                description="Les objectifs annoncés ont-ils été atteints ?"
                ratingKey="learningObjectives"
              />
              <StarRating
                rating={ratings.sessionStructure || 0}
                onRatingChange={handleRatingChange}
                label="Structure de la session"
                description="Organisation et progression logique"
                ratingKey="sessionStructure"
              />
            </div>
          </Card>

          {/* Progression et Apprentissage */}
          <Card
            headerStyle={styles.cardHeaderSuccess}
            title="📈 Progression et Apprentissage"
            subtitle="Évaluez votre progression et les acquis de cette formation"
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
              <StarRating
                rating={ratings.skillImprovement || 0}
                onRatingChange={handleRatingChange}
                label="Amélioration des compétences"
                description="Vos compétences se sont-elles développées ?"
                ratingKey="skillImprovement"
              />
              <StarRating
                rating={ratings.knowledgeGain || 0}
                onRatingChange={handleRatingChange}
                label="Acquisition de connaissances"
                description="Avez-vous appris de nouvelles choses ?"
                ratingKey="knowledgeGain"
              />
              <StarRating
                rating={ratings.practicalApplication || 0}
                onRatingChange={handleRatingChange}
                label="Application pratique"
                description="Pouvez-vous appliquer ce que vous avez appris ?"
                ratingKey="practicalApplication"
              />
              <StarRating
                rating={ratings.confidenceLevel || 0}
                onRatingChange={handleRatingChange}
                label="Niveau de confiance"
                description="Vous sentez-vous plus confiant dans ce domaine ?"
                ratingKey="confidenceLevel"
              />
            </div>
          </Card>

          {/* Organisation et Logistique */}
          <Card
            headerStyle={styles.cardHeaderInfo}
            title="📅 Organisation et Logistique"
            subtitle="Comment évaluez-vous l'organisation pratique de la session ?"
          >
            <div style={{ marginBottom: "2rem" }}>
              <label style={{ fontWeight: "600", marginBottom: "1rem", display: "block" }}>Durée de la session</label>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {["trop-courte", "parfaite", "trop-longue"].map((option) => (
                  <label key={option} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input
                      type="radio"
                      name="sessionDuration"
                      value={option}
                      checked={formData.sessionDuration === option}
                      onChange={(e) => handleInputChange("sessionDuration", e.target.value)}
                      style={styles.formCheckInput}
                    />
                    {option === "trop-courte" ? "Trop courte" : option === "parfaite" ? "Parfaite" : "Trop longue"}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
              <StarRating
                rating={ratings.pacing || 0}
                onRatingChange={handleRatingChange}
                label="Rythme de la formation"
                description="Le rythme était-il adapté ?"
                ratingKey="pacing"
              />
              <StarRating
                rating={ratings.environment || 0}
                onRatingChange={handleRatingChange}
                label="Environnement de formation"
                description="Lieu, ambiance, conditions matérielles"
                ratingKey="environment"
              />
            </div>
          </Card>

          {/* Impact et Valeur */}
          <Card
            headerStyle={styles.cardHeaderWarning}
            title="💼 Impact et Valeur de la Formation"
            subtitle="Quel est l'impact de cette formation sur votre parcours professionnel ?"
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
              <StarRating
                rating={ratings.careerImpact || 0}
                onRatingChange={handleRatingChange}
                label="Impact sur votre carrière"
                description="Cette formation vous aidera-t-elle professionnellement ?"
                ratingKey="careerImpact"
              />
              <StarRating
                rating={ratings.applicability || 0}
                onRatingChange={handleRatingChange}
                label="Applicabilité immédiate"
                description="Pouvez-vous utiliser ces acquis rapidement ?"
                ratingKey="applicability"
              />
              <StarRating
                rating={ratings.valueForTime || 0}
                onRatingChange={handleRatingChange}
                label="Rapport qualité/temps"
                description="Le temps investi en valait-il la peine ?"
                ratingKey="valueForTime"
              />
              <StarRating
                rating={ratings.expectationsMet || 0}
                onRatingChange={handleRatingChange}
                label="Attentes satisfaites"
                description="Vos attentes initiales ont-elles été comblées ?"
                ratingKey="expectationsMet"
              />
            </div>
          </Card>

          {/* Satisfaction et Recommandations */}
          <Card
            headerStyle={styles.cardHeaderSecondary}
            title="👍 Satisfaction et Recommandations"
            subtitle="Votre niveau de satisfaction et vos recommandations"
          >
            <div style={{ marginBottom: "2rem" }}>
              <StarRating
                rating={ratings.satisfactionLevel || 0}
                onRatingChange={handleRatingChange}
                label="Niveau de satisfaction global"
                description="À quel point êtes-vous satisfait de cette session ?"
                ratingKey="satisfactionLevel"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div>
                <label style={{ fontWeight: "600", marginBottom: "1rem", display: "block" }}>
                  Recommanderiez-vous cette formation ?
                </label>
                {["absolument", "probablement", "peut-etre", "non"].map((option) => (
                  <label key={option} style={styles.formCheck}>
                    <input
                      type="radio"
                      name="wouldRecommend"
                      value={option}
                      checked={formData.wouldRecommend === option}
                      onChange={(e) => handleInputChange("wouldRecommend", e.target.value)}
                      style={styles.formCheckInput}
                    />
                    {option === "absolument"
                      ? "Absolument"
                      : option === "probablement"
                        ? "Probablement"
                        : option === "peut-etre"
                          ? "Peut-être"
                          : "Non"}
                  </label>
                ))}
              </div>

              <div>
                <label style={{ fontWeight: "600", marginBottom: "1rem", display: "block" }}>
                  Participeriez-vous à une session similaire ?
                </label>
                {["oui", "selon-sujet", "non"].map((option) => (
                  <label key={option} style={styles.formCheck}>
                    <input
                      type="radio"
                      name="wouldAttendAgain"
                      value={option}
                      checked={formData.wouldAttendAgain === option}
                      onChange={(e) => handleInputChange("wouldAttendAgain", e.target.value)}
                      style={styles.formCheckInput}
                    />
                    {option === "oui" ? "Oui, avec plaisir" : option === "selon-sujet" ? "Selon le sujet" : "Non"}
                  </label>
                ))}
              </div>
            </div>
          </Card>

          {/* Points Forts et Améliorations */}
          <Card
            headerStyle={styles.cardHeaderDark}
            title="💡 Points Forts et Axes d'Amélioration"
            subtitle="Identifiez les aspects les plus réussis et ceux à améliorer"
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div>
                <label style={{ fontWeight: "600", marginBottom: "1rem", display: "block" }}>
                  Points forts de la session
                </label>
                <small style={{ color: "#666", display: "block", marginBottom: "1rem" }}>
                  (plusieurs choix possibles)
                </small>
                {[
                  "Contenu de qualité",
                  "Formateur compétent",
                  "Exercices pratiques",
                  "Interaction et échanges",
                  "Support pédagogique",
                  "Organisation parfaite",
                ].map((aspect) => (
                  <label key={aspect} style={styles.formCheck}>
                    <input
                      type="checkbox"
                      checked={formData.strongestAspects.includes(aspect)}
                      onChange={(e) => handleCheckboxChange("strongestAspects", aspect, e.target.checked)}
                      style={styles.formCheckInput}
                    />
                    {aspect}
                  </label>
                ))}
              </div>

              <div>
                <label style={{ fontWeight: "600", marginBottom: "1rem", display: "block" }}>
                  Domaines à améliorer
                </label>
                <small style={{ color: "#666", display: "block", marginBottom: "1rem" }}>
                  (plusieurs choix possibles)
                </small>
                {[
                  "Contenu plus approfondi",
                  "Plus d'exercices pratiques",
                  "Meilleure gestion du temps",
                  "Support technique",
                  "Interaction participante",
                  "Clarté des explications",
                ].map((area) => (
                  <label key={area} style={styles.formCheck}>
                    <input
                      type="checkbox"
                      checked={formData.improvementAreas.includes(area)}
                      onChange={(e) => handleCheckboxChange("improvementAreas", area, e.target.checked)}
                      style={styles.formCheckInput}
                    />
                    {area}
                  </label>
                ))}
              </div>
            </div>
          </Card>

          {/* Commentaires Détaillés */}
          <Card
            headerStyle={styles.cardHeaderPrimary}
            title="💬 Commentaires Détaillés"
            subtitle="Partagez vos impressions et suggestions en détail"
          >
            <div style={{ display: "grid", gap: "1.5rem" }}>
              <div>
                <label style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
                  Commentaire général sur la session
                </label>
                <textarea
                  style={styles.textarea}
                  rows="4"
                  placeholder="Partagez votre expérience globale de cette session de formation..."
                  value={formData.overallComments}
                  onChange={(e) => handleInputChange("overallComments", e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
                  Ce que vous avez le plus apprécié
                </label>
                <textarea
                  style={styles.textarea}
                  rows="3"
                  placeholder="Décrivez les aspects qui vous ont le plus marqué positivement..."
                  value={formData.bestAspects}
                  onChange={(e) => handleInputChange("bestAspects", e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
                  Suggestions d'amélioration
                </label>
                <textarea
                  style={styles.textarea}
                  rows="3"
                  placeholder="Comment pourrions-nous améliorer cette formation ?"
                  value={formData.suggestions}
                  onChange={(e) => handleInputChange("suggestions", e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontWeight: "600", marginBottom: "0.5rem", display: "block" }}>
                  Sujets supplémentaires souhaités
                </label>
                <textarea
                  style={styles.textarea}
                  rows="3"
                  placeholder="Quels sujets aimeriez-vous voir abordés dans de futures sessions ?"
                  value={formData.additionalTopics}
                  onChange={(e) => handleInputChange("additionalTopics", e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Bouton de soumission */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.button,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? (
                <>
                  <span style={styles.loadingSpinner}></span>
                  <span style={{ marginLeft: "0.5rem" }}>Envoi en cours...</span>
                </>
              ) : (
                <>📤 Envoyer l'Évaluation Complète</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FeedbackForm
