import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  IconButton,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
} from "@mui/material"
import { Close, Send, NavigateNext, NavigateBefore } from "@mui/icons-material"

const SessionFeedbackForm = ({ open, onClose, session, onFeedbackSubmitted }) => {
  console.log("FeedbackForm rendered with props:", { open, session })

  const [currentStep, setCurrentStep] = useState(0)
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

  const steps = [
    "Évaluation Globale",
    "Progression & Apprentissage",
    "Organisation & Logistique",
    "Impact & Valeur",
    "Satisfaction & Recommandations",
    "Points Forts & Améliorations",
    "Commentaires Détaillés",
  ]

  const EmojiRating = ({ rating, onRatingChange, label, description, ratingKey }) => {
    const emojis = ["😞", "😐", "🙂", "😊", "🤩"]
    const labels = ["Très mauvais", "Mauvais", "Moyen", "Bon", "Excellent"]
    const colors = ["#f44336", "#ff9800", "#ffc107", "#4caf50", "#2196f3"]

    return (
      <Box
        sx={{
          mb: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: "grey.50",
          border: "1px solid",
          borderColor: "grey.200",
          transition: "all 0.3s ease",
        }}
      >
        <Typography component="legend" variant="subtitle2" fontWeight="600" gutterBottom>
          {label}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
        )}

        <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap", mb: 1 }}>
          {emojis.map((emoji, index) => (
            <Box
              key={index}
              onClick={() => onRatingChange(ratingKey, index + 1)}
              sx={{
                cursor: "pointer",
                padding: "12px",
                borderRadius: "50%",
                backgroundColor: rating === index + 1 ? colors[index] + "20" : "transparent",
                border: rating === index + 1 ? `3px solid ${colors[index]}` : "2px solid transparent",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: colors[index] + "10",
                  transform: "scale(1.1)",
                },
              }}
            >
              <Typography sx={{ fontSize: "2.5rem" }}>{emoji}</Typography>
            </Box>
          ))}
        </Box>

        {rating > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1,
              borderRadius: 1,
              bgcolor: colors[rating - 1] + "10",
              border: `1px solid ${colors[rating - 1]}40`,
            }}
          >
            <Typography sx={{ fontSize: "1.5rem" }}>{emojis[rating - 1]}</Typography>
            <Typography variant="body2" fontWeight="600" sx={{ color: colors[rating - 1] }}>
              {labels[rating - 1]}
            </Typography>
          </Box>
        )}
      </Box>
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

  const handleNext = () => {
    setValidationError("")
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setValidationError("")
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Évaluation Globale
        const globalRatings = ["overallRating", "contentRelevance", "learningObjectives", "sessionStructure"]
        const missingGlobal = globalRatings.filter((rating) => !ratings[rating])
        if (missingGlobal.length > 0) {
          setValidationError("Veuillez compléter toutes les évaluations de cette section.")
          return false
        }
        break
      case 1: // Progression & Apprentissage
        const progressRatings = ["skillImprovement"]
        const missingProgress = progressRatings.filter((rating) => !ratings[rating])
        if (missingProgress.length > 0) {
          setValidationError("Veuillez évaluer au moins l'amélioration des compétences.")
          return false
        }
        break
      case 2: // Organisation & Logistique
        if (!formData.sessionDuration) {
          setValidationError("Veuillez indiquer votre avis sur la durée de la session.")
          return false
        }
        break
      case 4: // Satisfaction & Recommandations
        if (!ratings.satisfactionLevel || !formData.wouldRecommend) {
          setValidationError("Veuillez compléter le niveau de satisfaction et la recommandation.")
          return false
        }
        break
    }
    return true
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

    try {
      // Validation des données requises
      const user = JSON.parse(localStorage.getItem("user") || '{}')
      const sessionId = session?.id
      const userId = user?.id || session?.userId
      
      if (!sessionId) {
        setValidationError("ID de session manquant. Veuillez rafraîchir la page.")
        setIsSubmitting(false)
        return
      }
      
      if (!userId) {
        setValidationError("Utilisateur non identifié. Veuillez vous reconnecter.")
        setIsSubmitting(false)
        return
      }

      // Prepare data for backend
      const feedbackData = {
        sessionId: Number(sessionId),
        userId: Number(userId),
        ratings,
        sessionDuration: formData.sessionDuration,
        wouldRecommend: formData.wouldRecommend,
        wouldAttendAgain: formData.wouldAttendAgain,
        strongestAspects: formData.strongestAspects,
        improvementAreas: formData.improvementAreas,
        overallComments: formData.overallComments,
        bestAspects: formData.bestAspects,
        suggestions: formData.suggestions,
        additionalTopics: formData.additionalTopics,
        sessionComments: formData.overallComments,
        trainerComments: formData.bestAspects,
        teamComments: formData.suggestions,
        feedback: formData.overallComments || "Feedback submitted via form",
        timestamp: new Date().toISOString(),
      }

      // Make actual API call
      const response = await fetch('http://localhost:8000/feedback/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      const result = await response.json()
      console.log("Feedback submitted successfully:", result)
      
      setShowSuccess(true)
      setIsSubmitting(false)

      // Déclencher le rafraîchissement de la liste
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted()
      }

      // Close dialog after success
      setTimeout(() => {
        onClose()
        setCurrentStep(0)
      }, 2000)

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
    } catch (error) {
      console.error("Error submitting feedback:", error)
      let errorMessage = "Erreur lors de l'envoi du feedback. Veuillez réessayer."
      
      // Améliorer le message d'erreur basé sur la réponse
      if (error.response) {
        const statusCode = error.response.status
        if (statusCode === 400) {
          errorMessage = "Données invalides. Vérifiez que tous les champs requis sont remplis."
        } else if (statusCode === 404) {
          errorMessage = "Session ou utilisateur non trouvé. Rafraîchissez la page."
        } else if (statusCode === 500) {
          errorMessage = "Erreur serveur. Veuillez réessayer dans quelques instants."
        }
      }
      
      setValidationError(errorMessage)
      setIsSubmitting(false)
    }
  }

  const SectionCard = ({ children, headerStyle, title, subtitle, icon }) => (
    <Card sx={{ mb: 3, boxShadow: 3, borderRadius: 3, overflow: "hidden" }}>
      <CardHeader
        sx={{
          ...headerStyle,
          color: "white",
          "& .MuiCardHeader-content": {
            color: "white",
          },
        }}
        title={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: "1.5rem" }}>{icon}</Typography>
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
          </Box>
        }
        subheader={
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            {subtitle}
          </Typography>
        }
      />
      <CardContent sx={{ p: 3 }}>{children}</CardContent>
    </Card>
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Évaluation Globale
        return (
          <SectionCard
            headerStyle={{
              background: "linear-gradient(135deg, #1976d2, #1565c0)",
            }}
            title="Évaluation Globale de la Session"
            subtitle="Comment évaluez-vous l'ensemble de cette session de formation ?"
            icon="⭐"
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.overallRating || 0}
                  onRatingChange={handleRatingChange}
                  label="Note globale de la session *"
                  description="Évaluation générale de votre expérience"
                  ratingKey="overallRating"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.contentRelevance || 0}
                  onRatingChange={handleRatingChange}
                  label="Pertinence du contenu *"
                  description="Le contenu correspond-il à vos besoins ?"
                  ratingKey="contentRelevance"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.learningObjectives || 0}
                  onRatingChange={handleRatingChange}
                  label="Atteinte des objectifs *"
                  description="Les objectifs annoncés ont-ils été atteints ?"
                  ratingKey="learningObjectives"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.sessionStructure || 0}
                  onRatingChange={handleRatingChange}
                  label="Structure de la session *"
                  description="Organisation et progression logique"
                  ratingKey="sessionStructure"
                />
              </Grid>
            </Grid>
          </SectionCard>
        )

      case 1: // Progression et Apprentissage
        return (
          <SectionCard
            headerStyle={{
              background: "linear-gradient(135deg, #388e3c, #2e7d32)",
            }}
            title="Progression et Apprentissage"
            subtitle="Évaluez votre progression et les acquis de cette formation"
            icon="📈"
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.skillImprovement || 0}
                  onRatingChange={handleRatingChange}
                  label="Amélioration des compétences *"
                  description="Vos compétences se sont-elles développées ?"
                  ratingKey="skillImprovement"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.knowledgeGain || 0}
                  onRatingChange={handleRatingChange}
                  label="Acquisition de connaissances"
                  description="Avez-vous appris de nouvelles choses ?"
                  ratingKey="knowledgeGain"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.practicalApplication || 0}
                  onRatingChange={handleRatingChange}
                  label="Application pratique"
                  description="Pouvez-vous appliquer ce que vous avez appris ?"
                  ratingKey="practicalApplication"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.confidenceLevel || 0}
                  onRatingChange={handleRatingChange}
                  label="Niveau de confiance"
                  description="Vous sentez-vous plus confiant dans ce domaine ?"
                  ratingKey="confidenceLevel"
                />
              </Grid>
            </Grid>
          </SectionCard>
        )

      case 2: // Organisation et Logistique
        return (
          <SectionCard
            headerStyle={{
              background: "linear-gradient(135deg, #0288d1, #0277bd)",
            }}
            title="Organisation et Logistique"
            subtitle="Comment évaluez-vous l'organisation pratique de la session ?"
            icon="📅"
          >
            <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                ⏰ Durée de la session *
              </FormLabel>
              <RadioGroup
                value={formData.sessionDuration}
                onChange={(e) => handleInputChange("sessionDuration", e.target.value)}
                row
              >
                <FormControlLabel value="trop-courte" control={<Radio />} label="⏱️ Trop courte" />
                <FormControlLabel value="parfaite" control={<Radio />} label="✅ Parfaite" />
                <FormControlLabel value="trop-longue" control={<Radio />} label="⏳ Trop longue" />
              </RadioGroup>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.pacing || 0}
                  onRatingChange={handleRatingChange}
                  label="Rythme de la formation"
                  description="Le rythme était-il adapté ?"
                  ratingKey="pacing"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.environment || 0}
                  onRatingChange={handleRatingChange}
                  label="Environnement de formation"
                  description="Lieu, ambiance, conditions matérielles"
                  ratingKey="environment"
                />
              </Grid>
            </Grid>
          </SectionCard>
        )

      case 3: // Impact et Valeur
        return (
          <SectionCard
            headerStyle={{
              background: "linear-gradient(135deg, #f57c00, #ef6c00)",
            }}
            title="Impact et Valeur de la Formation"
            subtitle="Quel est l'impact de cette formation sur votre parcours professionnel ?"
            icon="💼"
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.careerImpact || 0}
                  onRatingChange={handleRatingChange}
                  label="Impact sur votre carrière"
                  description="Cette formation vous aidera-t-elle professionnellement ?"
                  ratingKey="careerImpact"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.applicability || 0}
                  onRatingChange={handleRatingChange}
                  label="Applicabilité immédiate"
                  description="Pouvez-vous utiliser ces acquis rapidement ?"
                  ratingKey="applicability"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.valueForTime || 0}
                  onRatingChange={handleRatingChange}
                  label="Rapport qualité/temps"
                  description="Le temps investi en valait-il la peine ?"
                  ratingKey="valueForTime"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.expectationsMet || 0}
                  onRatingChange={handleRatingChange}
                  label="Attentes satisfaites"
                  description="Vos attentes initiales ont-elles été comblées ?"
                  ratingKey="expectationsMet"
                />
              </Grid>
            </Grid>
          </SectionCard>
        )

      case 4: // Satisfaction et Recommandations
        return (
          <SectionCard
            headerStyle={{
              background: "linear-gradient(135deg, #424242, #303030)",
            }}
            title="Satisfaction et Recommandations"
            subtitle="Votre niveau de satisfaction et vos recommandations"
            icon="👍"
          >
            <Box sx={{ mb: 3 }}>
              <EmojiRating
                rating={ratings.satisfactionLevel || 0}
                onRatingChange={handleRatingChange}
                label="Niveau de satisfaction global *"
                description="À quel point êtes-vous satisfait de cette session ?"
                ratingKey="satisfactionLevel"
              />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                    🤔 Recommanderiez-vous cette formation ? *
                  </FormLabel>
                  <RadioGroup
                    value={formData.wouldRecommend}
                    onChange={(e) => handleInputChange("wouldRecommend", e.target.value)}
                  >
                    <FormControlLabel value="absolument" control={<Radio />} label="🌟 Absolument" />
                    <FormControlLabel value="probablement" control={<Radio />} label="👍 Probablement" />
                    <FormControlLabel value="peut-etre" control={<Radio />} label="🤷 Peut-être" />
                    <FormControlLabel value="non" control={<Radio />} label="👎 Non" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                    🔄 Participeriez-vous à une session similaire ?
                  </FormLabel>
                  <RadioGroup
                    value={formData.wouldAttendAgain}
                    onChange={(e) => handleInputChange("wouldAttendAgain", e.target.value)}
                  >
                    <FormControlLabel value="oui" control={<Radio />} label="😊 Oui, avec plaisir" />
                    <FormControlLabel value="selon-sujet" control={<Radio />} label="📚 Selon le sujet" />
                    <FormControlLabel value="non" control={<Radio />} label="❌ Non" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </SectionCard>
        )

      case 5: // Points Forts et Améliorations
        return (
          <SectionCard
            headerStyle={{
              background: "linear-gradient(135deg, #9c27b0, #7b1fa2)",
            }}
            title="Points Forts et Axes d'Amélioration"
            subtitle="Identifiez les aspects les plus réussis et ceux à améliorer"
            icon="💡"
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                    ✨ Points forts de la session
                  </FormLabel>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    (plusieurs choix possibles)
                  </Typography>
                  <FormGroup>
                    {[
                      "📚 Contenu de qualité",
                      "👨‍🏫 Formateur compétent",
                      "💻 Exercices pratiques",
                      "🗣️ Interaction et échanges",
                      "📖 Support pédagogique",
                      "⚡ Organisation parfaite",
                    ].map((aspect) => (
                      <FormControlLabel
                        key={aspect}
                        control={
                          <Checkbox
                            checked={formData.strongestAspects.includes(aspect)}
                            onChange={(e) => handleCheckboxChange("strongestAspects", aspect, e.target.checked)}
                          />
                        }
                        label={aspect}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                    🔧 Domaines à améliorer
                  </FormLabel>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    (plusieurs choix possibles)
                  </Typography>
                  <FormGroup>
                    {[
                      "📖 Contenu plus approfondi",
                      "💻 Plus d'exercices pratiques",
                      "⏰ Meilleure gestion du temps",
                      "🔧 Support technique",
                      "🤝 Interaction participante",
                      "💡 Clarté des explications",
                    ].map((area) => (
                      <FormControlLabel
                        key={area}
                        control={
                          <Checkbox
                            checked={formData.improvementAreas.includes(area)}
                            onChange={(e) => handleCheckboxChange("improvementAreas", area, e.target.checked)}
                          />
                        }
                        label={area}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
          </SectionCard>
        )

      case 6: // Commentaires Détaillés
        return (
          <SectionCard
            headerStyle={{
              background: "linear-gradient(135deg, #1976d2, #1565c0)",
            }}
            title="Commentaires Détaillés"
            subtitle="Partagez vos impressions et suggestions en détail"
            icon="💬"
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="💭 Commentaire général sur la session"
                  placeholder="Partagez votre expérience globale de cette session de formation..."
                  value={formData.overallComments}
                  onChange={(e) => handleInputChange("overallComments", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="⭐ Ce que vous avez le plus apprécié"
                  placeholder="Décrivez les aspects qui vous ont le plus marqué positivement..."
                  value={formData.bestAspects}
                  onChange={(e) => handleInputChange("bestAspects", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="💡 Suggestions d'amélioration"
                  placeholder="Comment pourrions-nous améliorer cette formation ?"
                  value={formData.suggestions}
                  onChange={(e) => handleInputChange("suggestions", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="📚 Sujets supplémentaires souhaités"
                  placeholder="Quels sujets aimeriez-vous voir abordés dans de futures sessions ?"
                  value={formData.additionalTopics}
                  onChange={(e) => handleInputChange("additionalTopics", e.target.value)}
                />
              </Grid>
            </Grid>
          </SectionCard>
        )

      default:
        return null
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: 1,
        }}
      >
        <Box>
          <Typography variant="h5" component="h1" fontWeight="bold">
            📚 Évaluation Complète de la Session
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            Étape {currentStep + 1} sur {steps.length}: {steps[currentStep]}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Progress Bar */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Progression: {Math.round(progress)}%
                </Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            </CardContent>
          </Card>

          {/* Stepper */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stepper activeStep={currentStep} alternativeLabel>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>

          {/* Success Message */}
          {showSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              ✅ Merci pour votre évaluation complète ! Votre feedback nous aidera à améliorer nos futures sessions de
              formation.
            </Alert>
          )}

          {/* Validation Error */}
          {validationError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              ⚠️ {validationError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {renderStepContent()}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={handleBack}
          disabled={currentStep === 0}
          variant="outlined"
          startIcon={<NavigateBefore />}
          size="large"
        >
          Précédent
        </Button>

        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
              {currentStep + 1} / {steps.length}
          </Typography>
        </Box>

        {currentStep === steps.length - 1 ? (
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
            disabled={isSubmitting}
            size="large"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer l'Évaluation"}
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (validateCurrentStep()) {
                handleNext()
              }
            }}
            variant="contained"
            endIcon={<NavigateNext />}
            size="large"
          >
            Suivant
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default SessionFeedbackForm
