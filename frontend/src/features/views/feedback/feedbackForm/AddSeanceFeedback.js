import { useState } from "react"
import {
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
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
} from "@mui/material"
import { Send, Person, Group, MenuBook, NavigateNext, NavigateBefore, Recommend } from "@mui/icons-material"
import "bootstrap/dist/css/bootstrap.min.css"
import axios from "axios";

const EmojiRating = ({ rating, onRatingChange, label }) => {
  const emojis = ["😞", "😐", "🙂", "😊", "🤩"]
  const labels = ["Très mauvais", "Mauvais", "Moyen", "Bon", "Excellent"]

  return (
    <Box sx={{ mb: 3 }}>
      <Typography component="legend" gutterBottom sx={{ fontWeight: "bold" }}>
        {label}
      </Typography>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
        {emojis.map((emoji, index) => (
          <Box
            key={index}
            onClick={() => onRatingChange(index + 1)}
            sx={{
              cursor: "pointer",
              padding: "8px",
              borderRadius: "50%",
              backgroundColor: rating === index + 1 ? "#e3f2fd" : "transparent",
              border: rating === index + 1 ? "2px solid #1976d2" : "2px solid transparent",
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                transform: "scale(1.1)",
              },
            }}
          >
            <Typography sx={{ fontSize: "2rem" }}>{emoji}</Typography>
          </Box>
        ))}
      </Box>
      {rating > 0 && (
        <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
          {labels[rating - 1]}
        </Typography>
      )}
    </Box>
  )
}

export default function AddSeanceFeedback({ seanceId }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [feedback, setFeedback] = useState({
    sessionRating: 0,
    contentQuality: 0,
    sessionDuration: "",
    sessionOrganization: 0,
    objectivesAchieved: 0,
    trainerRating: 0,
    trainerClarity: 0,
    trainerAvailability: 0,
    trainerPedagogy: 0,
    trainerInteraction: 0,
    teamRating: 0,
    teamCollaboration: 0,
    teamParticipation: 0,
    teamCommunication: 0,
    sessionComments: "",
    trainerComments: "",
    teamComments: "",
    suggestions: "",
    wouldRecommend: "",
    improvementAreas: [],
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showStepError, setShowStepError] = useState(false)

  // Gestionnaires optimisés pour éviter les re-rendus
  const handleTextChange = (field) => (event) => {
    const value = event.target.value
    setFeedback(prev => ({ ...prev, [field]: value }))
  }

  const steps = ["Guide des Emojis", "Déroulement de la Séance", "Évaluation du Formateur", "Évaluation de l'Équipe", "Recommandations"]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isStepValid()) {
      setShowStepError(true)
      return
    }
    setShowStepError(false)
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      // Exclure tout champ 'id' du feedback
      const { id, ...feedbackData } = feedback;
      await axios.post("http://localhost:8000/feedback/seance", {
        ...feedbackData,
        seanceId: Number(seanceId),
        userId: user?.id,
        improvementAreas: feedback.improvementAreas.join(", ") // backend attend string
      });
      setIsSubmitted(true)
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        alert("Erreur: " + (Array.isArray(err.response.data.message) ? err.response.data.message.join(' | ') : err.response.data.message));
      } else {
        alert("Erreur lors de l'envoi du feedback. Veuillez réessayer.");
      }
    }
  }

  const handleNext = () => {
    if (!isStepValid()) {
      setShowStepError(true)
      return
    }
    setShowStepError(false)
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleImprovementAreaChange = (area, checked) => {
    setFeedback((prev) => ({
      ...prev,
      improvementAreas: checked ? [...prev.improvementAreas, area] : prev.improvementAreas.filter((a) => a !== area),
    }))
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return true // Guide des emojis - étape informative
      case 1:
        return (
          feedback.sessionRating > 0 &&
          feedback.contentQuality > 0 &&
          feedback.sessionOrganization > 0 &&
          feedback.objectivesAchieved > 0 &&
          feedback.sessionDuration !== ""
        )
      case 2:
        return (
          feedback.trainerRating > 0 &&
          feedback.trainerClarity > 0 &&
          feedback.trainerPedagogy > 0 &&
          feedback.trainerAvailability > 0 &&
          feedback.trainerInteraction > 0
        )
      case 3:
        return true // Étape optionnelle
      case 4:
        return feedback.wouldRecommend !== "" // Seule la recommandation est obligatoire
      default:
        return true
    }
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <Typography variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Recommend color="primary" />
                Guide des Emojis et Commentaires
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Voici la signification des emojis utilisés dans ce formulaire
              </Typography>
            </CardHeader>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  🎯 Signification des Emojis d'Évaluation
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontSize: "2rem" }}>😞</Typography>
                    <Typography><strong>Très mauvais</strong> - Performance très insatisfaisante</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontSize: "2rem" }}>😐</Typography>
                    <Typography><strong>Mauvais</strong> - Performance en dessous des attentes</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontSize: "2rem" }}>🙂</Typography>
                    <Typography><strong>Moyen</strong> - Performance acceptable</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontSize: "2rem" }}>😊</Typography>
                    <Typography><strong>Bon</strong> - Performance satisfaisante</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontSize: "2rem" }}>🤩</Typography>
                    <Typography><strong>Excellent</strong> - Performance exceptionnelle</Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  ⏰ Autres Symboles Utilisés
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography>⏰ <strong>Trop courte</strong> - La durée était insuffisante</Typography>
                  <Typography>✅ <strong>Adéquate</strong> - La durée était parfaite</Typography>
                  <Typography>⏳ <strong>Trop longue</strong> - La durée était excessive</Typography>
                  <Typography>💬 <strong>Commentaires</strong> - Zone de texte libre</Typography>
                </Box>
              </Box>
              
              <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  💡 <strong>Conseil :</strong> Prenez le temps de réfléchir à chaque critère avant de donner votre évaluation. Vos retours sont précieux pour améliorer la qualité des formations.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )

      case 1:
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <Typography variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <MenuBook color="primary" />
                Évaluation du Déroulement de la Séance
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Comment évaluez-vous le contenu et l'organisation de la séance ?
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="row">
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.sessionRating}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, sessionRating: rating }))}
                    label="Note globale de la séance"
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.contentQuality}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, contentQuality: rating }))}
                    label="Qualité du contenu"
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.sessionOrganization}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, sessionOrganization: rating }))}
                    label="Organisation de la séance"
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.objectivesAchieved}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, objectivesAchieved: rating }))}
                    label="Objectifs atteints"
                  />
                </div>
              </div>

              <FormControl component="fieldset" sx={{ mt: 3, mb: 3 }}>
                <FormLabel component="legend" sx={{ fontWeight: "bold" }}>
                  Durée de la séance
                </FormLabel>
                <RadioGroup
                  value={feedback.sessionDuration}
                  onChange={(e) => setFeedback((prev) => ({ ...prev, sessionDuration: e.target.value }))}
                  row
                >
                  <FormControlLabel value="trop-courte" control={<Radio />} label="⏰ Trop courte" />
                  <FormControlLabel value="adequate" control={<Radio />} label="✅ Adéquate" />
                  <FormControlLabel value="trop-longue" control={<Radio />} label="⏳ Trop longue" />
                </RadioGroup>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="💬 Commentaires sur la séance (optionnel)"
                value={feedback.sessionComments}
                onChange={handleTextChange('sessionComments')}
                placeholder="Partagez vos impressions sur le déroulement de la séance..."
                variant="outlined"
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <Typography variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Person color="primary" />
                Évaluation du Formateur
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Comment évaluez-vous les compétences et l'approche du formateur ?
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="row">
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.trainerRating}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, trainerRating: rating }))}
                    label="Note globale du formateur"
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.trainerClarity}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, trainerClarity: rating }))}
                    label="Clarté des explications"
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.trainerPedagogy}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, trainerPedagogy: rating }))}
                    label="Approche pédagogique"
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.trainerAvailability}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, trainerAvailability: rating }))}
                    label="Disponibilité et écoute"
                  />
                </div>
              </div>

              <EmojiRating
                rating={feedback.trainerInteraction}
                onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, trainerInteraction: rating }))}
                label="Interaction avec les étudiants"
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="💬 Commentaires sur le formateur (optionnel)"
                value={feedback.trainerComments}
                onChange={handleTextChange('trainerComments')}
                placeholder="Partagez vos impressions sur le formateur..."
                variant="outlined"
                sx={{ mt: 3 }}
              />
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <Typography variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Group color="primary" />
                Évaluation de l'Équipe d'Étudiants
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Comment évaluez-vous la collaboration et la participation de votre équipe ? (optionnel)
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="row">
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.teamRating}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, teamRating: rating }))}
                    label="Note globale de l'équipe"
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.teamCollaboration}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, teamCollaboration: rating }))}
                    label="Esprit de collaboration"
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.teamParticipation}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, teamParticipation: rating }))}
                    label="Niveau de participation"
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.teamCommunication}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, teamCommunication: rating }))}
                    label="Qualité de la communication"
                  />
                </div>
              </div>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="💬 Commentaires sur l'équipe (optionnel)"
                value={feedback.teamComments}
                onChange={handleTextChange('teamComments')}
                placeholder="Partagez vos impressions sur le travail d'équipe..."
                variant="outlined"
                sx={{ mt: 3 }}
              />
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <Typography variant="h5" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Recommend color="primary" />
                Recommandations et Suggestions
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Aidez-nous à améliorer nos formations
              </Typography>
            </CardHeader>
            <CardContent>
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ fontWeight: "bold" }}>
                  🤔 Recommanderiez-vous cette formation ? *
                </FormLabel>
                <RadioGroup
                  value={feedback.wouldRecommend}
                  onChange={(e) => setFeedback((prev) => ({ ...prev, wouldRecommend: e.target.value }))}
                >
                  <FormControlLabel value="oui" control={<Radio />} label="👍 Oui, certainement" />
                  <FormControlLabel value="peut-etre" control={<Radio />} label="🤷 Peut-être" />
                  <FormControlLabel value="non" control={<Radio />} label="👎 Non" />
                </RadioGroup>
              </FormControl>

              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ fontWeight: "bold" }}>
                  🔧 Domaines d'amélioration (plusieurs choix possibles)
                </FormLabel>
                <FormGroup>
                  <div className="row">
                    {[
                      "📚 Contenu du cours",
                      "🎯 Méthodes pédagogiques",
                      "📖 Support de cours",
                      "💻 Exercices pratiques",
                      "⏰ Gestion du temps",
                      "🗣️ Interaction avec les étudiants",
                      "🏢 Environnement de formation",
                      "🔧 Outils techniques",
                    ].map((area) => (
                      <div className="col-md-6" key={area}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={feedback.improvementAreas.includes(area)}
                              onChange={(e) => handleImprovementAreaChange(area, e.target.checked)}
                            />
                          }
                          label={area}
                        />
                      </div>
                    ))}
                  </div>
                </FormGroup>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="💡 Suggestions d'amélioration (optionnel)"
                value={feedback.suggestions}
                onChange={handleTextChange('suggestions')}
                placeholder="Quelles améliorations suggérez-vous pour les prochaines formations ?"
                variant="outlined"
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  const progress = (currentStep / steps.length) * 100

  if (isSubmitted) {
    return (
      <div className="container-fluid py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <Card className="shadow-lg" sx={{ mt: 8, textAlign: "center" }}>
              <CardContent>
                <Typography variant="h3" sx={{ color: "#1976d2", fontWeight: "bold", mb: 2 }}>
                  🎉 Merci pour votre feedback !
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                  Votre avis a bien été enregistré.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Nous apprécions le temps que vous avez pris pour nous aider à améliorer nos formations.
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
              📝 Formulaire de Feedback
            </Typography>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Séance de Formation
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Votre avis nous aide à améliorer la qualité de nos formations
            </Typography>
          </Box>

          {/* Progress Bar */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Étape {currentStep + 1} sur {steps.length}: {steps[currentStep]}
                </Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {Math.round(progress)}% complété
                </Typography>
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

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            {renderStepContent(currentStep)}

            {/* Navigation Buttons */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    startIcon={<NavigateBefore />}
                    size="large"
                  >
                    Précédent
                  </Button>

                  <Typography variant="body2" color="text.secondary">
                    {currentStep + 1} / {steps.length}
                  </Typography>

                  {currentStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Send />}
                      size="large"
                      sx={{ minWidth: 150 }}
                    >
                      Envoyer le Feedback
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<NavigateNext />}
                      size="large"
                      sx={{ minWidth: 150 }}
                    >
                      Suivant
                    </Button>
                  )}
                </Box>
                {showStepError && (
                  <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
                    Veuillez remplir tous les champs obligatoires avant de continuer.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </form>

          {/* Reset Button */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="text"
              color="error"
              onClick={() => {
                setCurrentStep(0)
                setFeedback({
                  sessionRating: 0,
                  contentQuality: 0,
                  sessionDuration: "",
                  sessionOrganization: 0,
                  objectivesAchieved: 0,
                  trainerRating: 0,
                  trainerClarity: 0,
                  trainerAvailability: 0,
                  trainerPedagogy: 0,
                  trainerInteraction: 0,
                  teamRating: 0,
                  teamCollaboration: 0,
                  teamParticipation: 0,
                  teamCommunication: 0,
                  sessionComments: "",
                  trainerComments: "",
                  teamComments: "",
                  suggestions: "",
                  wouldRecommend: "",
                  improvementAreas: [],
                })
              }}
            >
              🔄 Réinitialiser le formulaire
            </Button>
          </Box>
        </div>
      </div>
    </div>
  )
}