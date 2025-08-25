"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
// import { feedbackService } from "./services/feedbackService"
import feedbackService from '../../../../services/feedbackService';

import {
  Container,
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

  Button,
  Box,
  Grid,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Chip,

  Avatar,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  Send,
  NavigateNext,
  NavigateBefore,
  Close,
  BugReport,
  Feedback,
  Report,
  Support,
  PriorityHigh,
  CheckCircle,
  Warning,

} from "@mui/icons-material"

const FeedbackPage = () => {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    feedbackType: "",
    priority: "",
    category: "",
    subcategory: "",
    title: "",
    description: "",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
    browser: "",
    device: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const steps = [
    t("feedback.steps.type"),
    t("feedback.steps.category"),
    t("feedback.steps.description"),
    t("feedback.steps.technical"),
  ]

  const feedbackTypes = [
    {
      value: "bug",
      label: `🐛 ${t("feedback.feedbackTypes.bug")}`,
      description: t("feedback.feedbackTypesDescriptions.bug"),
      icon: <BugReport />,
      color: "#f44336",
    },
    {
      value: "feature",
      label: `💡 ${t("feedback.feedbackTypes.feature")}`,
      description: t("feedback.feedbackTypesDescriptions.feature"),
      icon: <Feedback />,
      color: "#2196f3",
    },
    {
      value: "improvement",
      label: `⚡ ${t("feedback.feedbackTypes.improvement")}`,
      description: t("feedback.feedbackTypesDescriptions.improvement"),
      icon: <Support />,
      color: "#4caf50",
    },
    {
      value: "complaint",
      label: `⚠️ ${t("feedback.feedbackTypes.complaint")}`,
      description: t("feedback.feedbackTypesDescriptions.complaint"),
      icon: <Report />,
      color: "#ff9800",
    },
  ]

  const categories = {
    bug: [
      "ui",
      "auth",
      "courseManagement",
      "chatbot",
      "videoConference",
      "whiteboard",
      "quizAssessment",
      "userProfile",
      "notifications",
      "performance",
      "mobileResponsive",
      "other",
    ],
    feature: [
      "ui",
      "courseManagement",
      "communication",
      "assessments",
      "reports",
      "integrations",
      "accessibility",
      "customization",
      "other",
    ],
    improvement: [
      "ui",
      "performance",
      "existingFeatures",
      "ux",
      "documentation",
      "other",
    ],
    complaint: [
      "customerService",
      "contentQuality",
      "technicalIssues",
      "ux",
      "support",
      "other",
    ],
  }

  const priorities = [
    { value: "low", label: `🟢 ${t("feedback.priorities.low")}`, description: t("feedback.priorityDescriptions.low"), color: "#4caf50" },
    { value: "medium", label: `🟡 ${t("feedback.priorities.medium")}`, description: t("feedback.priorityDescriptions.medium"), color: "#ff9800" },
    { value: "high", label: `🔴 ${t("feedback.priorities.high")}`, description: t("feedback.priorityDescriptions.high"), color: "#f44336" },
    { value: "critical", label: `🚨 ${t("feedback.priorities.critical")}`, description: t("feedback.priorityDescriptions.critical"), color: "#d32f2f" },
  ]

  const browsers = [
    "Chrome",
    "Firefox",
    "Safari",
    "Edge",
    "Opera",
    "Other",
    "MobileApp",
  ]

  const devices = [
    "Desktop",
    "Laptop",
    "Tablet",
    "Smartphone",
    "Other",
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setValidationError("")
  }

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
    setValidationError("")
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.feedbackType) {
          setValidationError(t("feedback.validation.selectType"))
          return false
        }
        break
      case 1:
        if (!formData.category || !formData.priority) {
          setValidationError(t("feedback.validation.selectCategoryPriority"))
          return false
        }
        break
      case 2:
        if (!formData.title || !formData.description) {
          setValidationError(t("feedback.validation.fillTitleDescription"))
          return false
        }
        break
      case 3:
        // Étape optionnelle
        break
      default:
        break
    }
    return true
  }

  const validateForm = () => {
    const requiredFields = ["feedbackType", "category", "priority", "title", "description"]
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      setValidationError(t("feedback.validation.completeRequired"))
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
      const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
      const feedbackData = {
        ...formData,
        userId: user ? user.id : null,
      }
      
      console.log("Feedback Data:", feedbackData)
      await feedbackService.submitGeneralFeedback(feedbackData)
      
      setShowSuccess(true)
      setIsSubmitting(false)

      // Réinitialiser le formulaire après succès
      setTimeout(() => {
        setFormData({
          feedbackType: "",
          priority: "",
          category: "",
          subcategory: "",
          title: "",
          description: "",
          stepsToReproduce: "",
          expectedBehavior: "",
          actualBehavior: "",
          browser: "",
          device: "",
        })
        setCurrentStep(0)
        setShowSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Erreur lors de l'envoi du feedback:", error)
      
      let errorMessage = t("feedback.errors.generic")
      
      if (error.response) {
        // Erreur de réponse du serveur
        if (error.response.status === 400) {
          errorMessage = t("feedback.errors.invalidData")
        } else if (error.response.status === 500) {
          errorMessage = t("feedback.errors.serverError")
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        }
      } else if (error.request) {
        // Erreur de connexion
        errorMessage = t("feedback.errors.networkError")
      }
      
      setValidationError(errorMessage)
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title={t("feedback.headers.typeTitle")}
              subheader={t("feedback.headers.typeSub")}
            />
            <CardContent>
              <Grid container spacing={2}>
                {feedbackTypes.map((type) => (
                  <Grid item xs={12} md={6} key={type.value}>
                    <Card
                      sx={{
                        cursor: "pointer",
                        border: formData.feedbackType === type.value ? `3px solid ${type.color}` : "1px solid #e0e0e0",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: type.color,
                          transform: "translateY(-2px)",
                          boxShadow: 3,
                        },
                      }}
                      onClick={() => handleInputChange("feedbackType", type.value)}
                    >
                      <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                          <Avatar sx={{ bgcolor: type.color }}>{type.icon}</Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {type.label}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )

      case 1:
        return (
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title={t("feedback.headers.categoryTitle")}
              subheader={t("feedback.headers.categorySub")}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset" sx={{ width: "100%" }}>
                    <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
                      📂 {t("feedback.category")} *
                    </FormLabel>
                    <RadioGroup
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                    >
                      {categories[formData.feedbackType]?.map((category) => (
                        <FormControlLabel
                          key={category}
                          value={category}
                          control={<Radio />}
                          label={t(`feedback.categoryOptions.${category}`)}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset" sx={{ width: "100%" }}>
                    <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
                      <PriorityHigh sx={{ mr: 1, verticalAlign: "middle" }} />
                      {t("feedback.steps.category")} *
                    </FormLabel>
                    <RadioGroup
                      value={formData.priority}
                      onChange={(e) => handleInputChange("priority", e.target.value)}
                    >
                      {priorities.map((priority) => (
                        <FormControlLabel
                          key={priority.value}
                          value={priority.value}
                          control={<Radio />}
                          label={
                            <Box>
                              <Typography variant="body1">{priority.label}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {priority.description}
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title={t("feedback.headers.descriptionTitle")}
              subheader={t("feedback.headers.descriptionSub")}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("feedback.formLabels.title")}
                    placeholder={t("feedback.formLabels.titlePlaceholder")}
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label={t("feedback.formLabels.description")}
                    placeholder={t("feedback.formLabels.descriptionPlaceholder")}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                {formData.feedbackType === "bug" && (
                  <>
                    
                    
                    
                  </>
                )}
              </Grid>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title={t("feedback.headers.technicalTitle")}
              subheader={t("feedback.headers.technicalSub")}
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                      {t("feedback.formLabels.browser")}
                    </FormLabel>
                    <RadioGroup
                      value={formData.browser}
                      onChange={(e) => handleInputChange("browser", e.target.value)}
                    >
                      {browsers.map((browser) => (
                        <FormControlLabel
                          key={browser}
                          value={browser}
                          control={<Radio />}
                          label={t(`feedback.browsers.${browser}`)}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                      {t("feedback.formLabels.device")}
                    </FormLabel>
                    <RadioGroup
                      value={formData.device}
                      onChange={(e) => handleInputChange("device", e.target.value)}
                    >
                      {devices.map((device) => (
                        <FormControlLabel
                          key={device}
                          value={device}
                          control={<Radio />}
                          label={t(`feedback.devices.${device}`)}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )



      default:
        return null
    }
  }

  const progress = (currentStep / steps.length) * 100

  const getFeedbackTypeInfo = () => {
    return feedbackTypes.find((type) => type.value === formData.feedbackType)
  }

  const getPriorityInfo = () => {
    return priorities.find((priority) => priority.value === formData.priority)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
          {t("feedback.header.titleComplaint")}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          {t("feedback.header.subtitleComplaint")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("feedback.header.descriptionComplaint")}
        </Typography>
      </Box>

      {/* Barre de progression */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {t("feedback.progressLabel")}: {Math.round(progress)}%
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

      {/* Message de succès */}
      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <CheckCircle sx={{ mr: 1 }} />
          {t("feedback.success")}
        </Alert>
      )}

      {/* Erreur de validation */}
      {validationError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Warning sx={{ mr: 1 }} />
          {validationError}
        </Alert>
      )}

      {/* Contenu du formulaire */}
      <Box component="form" onSubmit={handleSubmit}>
        {renderStepContent()}
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 3 }}>
        <Button
          onClick={handleBack}
          disabled={currentStep === 0}
          variant="outlined"
          startIcon={<NavigateBefore />}
          size="large"
        >
          {t("common.back")}
        </Button>

        <Box sx={{ flex: 1, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            {t("common.loading") /* keeps minimal; optional to add step i18n later */}
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
            {isSubmitting ? t("feedback.actions.sending") : t("feedback.sendFeedback")}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            variant="contained"
            endIcon={<NavigateNext />}
            size="large"
          >
            {t("common.next")}
          </Button>
        )}
      </Box>

      {/* Dialog d'aperçu */}
      <Dialog open={showPreview} onClose={() => setShowPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">{t("feedback.preview")}</Typography>
            <IconButton onClick={() => setShowPreview(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  {getFeedbackTypeInfo()?.icon}
                  <Typography variant="h6">{getFeedbackTypeInfo()?.label}</Typography>
                  <Chip
                    label={getPriorityInfo()?.label}
                    sx={{ bgcolor: getPriorityInfo()?.color, color: "white" }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {formData.title}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                  {formData.description}
                </Typography>
              </Grid>
              {formData.category && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t("feedback.previewLabels.category")}:</strong> {formData.category}
                  </Typography>
                </Grid>
              )}
              {formData.browser && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t("feedback.previewLabels.browser")}:</strong> {t(`feedback.browsers.${formData.browser}`)}
                  </Typography>
                </Grid>
              )}
              {formData.device && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>{t("feedback.previewLabels.device")}:</strong> {t(`feedback.devices.${formData.device}`)}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>{t("common.close")}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default FeedbackPage 