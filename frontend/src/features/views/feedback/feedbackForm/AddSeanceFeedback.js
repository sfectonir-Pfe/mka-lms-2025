import { useState } from "react"
import { useTranslation } from "react-i18next"
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
import api from "../../../../api/axiosInstance";

const EmojiRating = ({ rating, onRatingChange, label }) => {
  const { t } = useTranslation()
  const emojis = ["😞", "😐", "🙂", "😊", "🤩"]
  const labels = [
    t('seanceFeedbackForm.ratings.veryBad'),
    t('seanceFeedbackForm.ratings.bad'),
    t('seanceFeedbackForm.ratings.average'),
    t('seanceFeedbackForm.ratings.good'),
    t('seanceFeedbackForm.ratings.excellent')
  ]

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
  const { t } = useTranslation()
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

  const handleTextChange = (field) => (event) => {
    const value = event.target.value
    setFeedback(prev => ({ ...prev, [field]: value }))
  }

  const steps = [
    t('seanceFeedbackForm.steps.guide'),
    t('seanceFeedbackForm.steps.sessionFlow'),
    t('seanceFeedbackForm.steps.trainerEval'),
    t('seanceFeedbackForm.steps.teamEval'),
    t('seanceFeedbackForm.steps.recommendations')
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isStepValid()) {
      setShowStepError(true)
      return
    }
    setShowStepError(false)
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const { id, ...feedbackData } = feedback;
      await api.post("/feedback/seance", {
        ...feedbackData,
        seanceId: Number(seanceId),
        userId: user?.id,
        improvementAreas: feedback.improvementAreas.join(", ")
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
        return true
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
        return true
      case 4:
        return feedback.wouldRecommend !== ""
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
                {t('seanceFeedbackForm.guide.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('seanceFeedbackForm.guide.desc')}
              </Typography>
            </CardHeader>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  {t('seanceFeedbackForm.guide.ratingsTitle')}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontSize: "2rem" }}>😞</Typography>
                    <Typography><strong>{t('seanceFeedbackForm.ratings.veryBad')}</strong></Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontSize: "2rem" }}>😐</Typography>
                    <Typography><strong>{t('seanceFeedbackForm.ratings.bad')}</strong></Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontSize: "2rem" }}>🙂</Typography>
                    <Typography><strong>{t('seanceFeedbackForm.ratings.average')}</strong></Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontSize: "2rem" }}>😊</Typography>
                    <Typography><strong>{t('seanceFeedbackForm.ratings.good')}</strong></Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography sx={{ fontSize: "2rem" }}>🤩</Typography>
                    <Typography><strong>{t('seanceFeedbackForm.ratings.excellent')}</strong></Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  {t('seanceFeedbackForm.guide.otherSymbolsTitle')}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Typography>{t('seanceFeedbackForm.guide.durationShort')}</Typography>
                  <Typography>{t('seanceFeedbackForm.guide.durationAdequate')}</Typography>
                  <Typography>{t('seanceFeedbackForm.guide.durationLong')}</Typography>
                  <Typography>{t('seanceFeedbackForm.guide.comments')}</Typography>
                </Box>
              </Box>

              <Box sx={{ p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('seanceFeedbackForm.guide.tip')}
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
                {t('seanceFeedbackForm.sessionFlow.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('seanceFeedbackForm.sessionFlow.subtitle')}
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="row">
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.sessionRating}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, sessionRating: rating }))}
                    label={t('seanceFeedbackForm.sessionFlow.sessionRating')}
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.contentQuality}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, contentQuality: rating }))}
                    label={t('seanceFeedbackForm.sessionFlow.contentQuality')}
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.sessionOrganization}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, sessionOrganization: rating }))}
                    label={t('seanceFeedbackForm.sessionFlow.sessionOrganization')}
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.objectivesAchieved}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, objectivesAchieved: rating }))}
                    label={t('seanceFeedbackForm.sessionFlow.objectivesAchieved')}
                  />
                </div>
              </div>

              <FormControl component="fieldset" sx={{ mt: 3, mb: 3 }}>
                <FormLabel component="legend" sx={{ fontWeight: "bold" }}>
                  {t('seanceFeedbackForm.sessionFlow.duration')}
                </FormLabel>
                <RadioGroup
                  value={feedback.sessionDuration}
                  onChange={(e) => setFeedback((prev) => ({ ...prev, sessionDuration: e.target.value }))}
                  row
                >
                  <FormControlLabel value="trop-courte" control={<Radio />} label={t('seanceFeedbackForm.sessionFlow.durationShort')} />
                  <FormControlLabel value="adequate" control={<Radio />} label={t('seanceFeedbackForm.sessionFlow.durationAdequate')} />
                  <FormControlLabel value="trop-longue" control={<Radio />} label={t('seanceFeedbackForm.sessionFlow.durationLong')} />
                </RadioGroup>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={4}
                label={t('seanceFeedbackForm.sessionFlow.commentsLabel')}
                value={feedback.sessionComments}
                onChange={handleTextChange('sessionComments')}
                placeholder={t('seanceFeedbackForm.sessionFlow.commentsPlaceholder')}
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
                {t('seanceFeedbackForm.trainerEval.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('seanceFeedbackForm.trainerEval.subtitle')}
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="row">
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.trainerRating}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, trainerRating: rating }))}
                    label={t('seanceFeedbackForm.trainerEval.trainerRating')}
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.trainerClarity}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, trainerClarity: rating }))}
                    label={t('seanceFeedbackForm.trainerEval.trainerClarity')}
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.trainerPedagogy}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, trainerPedagogy: rating }))}
                    label={t('seanceFeedbackForm.trainerEval.trainerPedagogy')}
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.trainerAvailability}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, trainerAvailability: rating }))}
                    label={t('seanceFeedbackForm.trainerEval.trainerAvailability')}
                  />
                </div>
              </div>

              <EmojiRating
                rating={feedback.trainerInteraction}
                onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, trainerInteraction: rating }))}
                label={t('seanceFeedbackForm.trainerEval.trainerInteraction')}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label={t('seanceFeedbackForm.trainerEval.commentsLabel')}
                value={feedback.trainerComments}
                onChange={handleTextChange('trainerComments')}
                placeholder={t('seanceFeedbackForm.trainerEval.commentsPlaceholder')}
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
                {t('seanceFeedbackForm.teamEval.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('seanceFeedbackForm.teamEval.subtitle')}
              </Typography>
            </CardHeader>
            <CardContent>
              <div className="row">
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.teamRating}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, teamRating: rating }))}
                    label={t('seanceFeedbackForm.teamEval.teamRating')}
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.teamCollaboration}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, teamCollaboration: rating }))}
                    label={t('seanceFeedbackForm.teamEval.teamCollaboration')}
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.teamParticipation}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, teamParticipation: rating }))}
                    label={t('seanceFeedbackForm.teamEval.teamParticipation')}
                  />
                </div>
                <div className="col-md-6">
                  <EmojiRating
                    rating={feedback.teamCommunication}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, teamCommunication: rating }))}
                    label={t('seanceFeedbackForm.teamEval.teamCommunication')}
                  />
                </div>
              </div>

              <TextField
                fullWidth
                multiline
                rows={4}
                label={t('seanceFeedbackForm.teamEval.commentsLabel')}
                value={feedback.teamComments}
                onChange={handleTextChange('teamComments')}
                placeholder={t('seanceFeedbackForm.teamEval.commentsPlaceholder')}
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
                {t('seanceFeedbackForm.recommendations.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('seanceFeedbackForm.recommendations.subtitle')}
              </Typography>
            </CardHeader>
            <CardContent>
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ fontWeight: "bold" }}>
                  {t('seanceFeedbackForm.recommendations.wouldRecommend')}
                </FormLabel>
                <RadioGroup
                  value={feedback.wouldRecommend}
                  onChange={(e) => setFeedback((prev) => ({ ...prev, wouldRecommend: e.target.value }))}
                >
                  <FormControlLabel value="oui" control={<Radio />} label={t('seanceFeedbackForm.recommendations.optYes')} />
                  <FormControlLabel value="peut-etre" control={<Radio />} label={t('seanceFeedbackForm.recommendations.optMaybe')} />
                  <FormControlLabel value="non" control={<Radio />} label={t('seanceFeedbackForm.recommendations.optNo')} />
                </RadioGroup>
              </FormControl>

              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ fontWeight: "bold" }}>
                  {t('seanceFeedbackForm.recommendations.improvementAreas')}
                </FormLabel>
                <FormGroup>
                  <div className="row">
                    {[
                      t('seanceFeedbackForm.recommendations.areas.courseContent'),
                      t('seanceFeedbackForm.recommendations.areas.pedagogy'),
                      t('seanceFeedbackForm.recommendations.areas.materials'),
                      t('seanceFeedbackForm.recommendations.areas.practices'),
                      t('seanceFeedbackForm.recommendations.areas.time'),
                      t('seanceFeedbackForm.recommendations.areas.interaction'),
                      t('seanceFeedbackForm.recommendations.areas.environment'),
                      t('seanceFeedbackForm.recommendations.areas.tools'),
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
                label={t('seanceFeedbackForm.recommendations.suggestionsLabel')}
                value={feedback.suggestions}
                onChange={handleTextChange('suggestions')}
                placeholder={t('seanceFeedbackForm.recommendations.suggestionsPlaceholder')}
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
                  {t('seanceFeedbackForm.success.title')}
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                  {t('seanceFeedbackForm.success.subtitle')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t('seanceFeedbackForm.success.desc')}
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
              {t('seanceFeedbackForm.title')}
            </Typography>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {t('seanceFeedbackForm.subtitle')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('seanceFeedbackForm.helper')}
            </Typography>
          </Box>

          {/* Progress Bar */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {t('seanceFeedbackForm.progress.stepXofY', { current: currentStep + 1, total: steps.length, label: steps[currentStep] })}
                </Typography>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {t('seanceFeedbackForm.progress.percentCompleted', { percent: Math.round(progress) })}
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
                    {t('seanceFeedbackForm.buttons.prev')}
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
                      {t('seanceFeedbackForm.buttons.submit')}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<NavigateNext />}
                      size="large"
                      sx={{ minWidth: 150 }}
                    >
                      {t('seanceFeedbackForm.buttons.next')}
                    </Button>
                  )}
                </Box>
                {showStepError && (
                  <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
                    {t('seanceFeedbackForm.errors.stepRequired')}
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
              {t('seanceFeedbackForm.buttons.reset')}
            </Button>
          </Box>
        </div>
      </div>
    </div>
  )
}