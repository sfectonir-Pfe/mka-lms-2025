import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import api from "../../../../api/axiosInstance"
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
  const { t, i18n } = useTranslation()
  const d = (fr, ar) => (i18n.language === "ar" ? ar : fr)
  const tr = (key, frDefault, arDefault) => {
    const value = i18n.getResource(i18n.language, 'translation', key)
    if (typeof value === 'string') return value
    return d(frDefault, arDefault)
  }
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
    // Commentaires détaillés
    contentQuality: "",
    trainerPerformance: "",
    sessionOrganization: "",
    learningMaterials: "",
    interactionLevel: "",
    technicalAspects: "",
    commentCategories: [],
    commentPriority: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [validationError, setValidationError] = useState("")

  const steps = useMemo(() => [
    tr("sessions.guide", "Guide des Évaluations", "دليل التقييم"),
    tr("sessions.globalEvaluation", "Évaluation Globale", "التقييم العام"),
    tr("sessions.progressionAndLearning", "Progression & Apprentissage", "التقدّم والتعلّم"),
    tr("sessions.organizationAndLogistics", "Organisation & Logistique", "التنظيم واللوجستيات"),
    tr("sessions.impactAndValue", "Impact & Valeur", "الأثر والقيمة"),
    tr("sessions.satisfactionAndRecommendations", "Satisfaction & Recommandations", "الرضا والتوصيات"),
    tr("sessions.strengthsAndImprovements", "Points Forts & Améliorations", "نقاط القوة والتحسينات"),
    tr("sessions.detailedComments", "Commentaires Détaillés", "تعليقات تفصيلية"),
  ], [i18n.language])

  const EmojiRating = ({ rating, onRatingChange, label, description, ratingKey }) => {
    const emojis = ["😞", "😐", "🙂", "😊", "🤩"]
    const labels = [
      tr("sessions.ratingScaleVeryBad", "Très mauvais", "سيئ جدًا"),
      tr("sessions.ratingScaleBad", "Mauvais", "سيئ"),
      tr("sessions.ratingScaleAverage", "Moyen", "متوسط"),
      tr("sessions.ratingScaleGood", "Bien", "جيد"),
      tr("sessions.ratingScaleExcellent", "Excellent", "ممتاز"),
    ]
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
      case 0: // Guide des Évaluations - pas de validation nécessaire
        return true
      case 1: // Évaluation Globale
        const globalRatings = ["overallRating", "contentRelevance", "learningObjectives", "sessionStructure"]
        const missingGlobal = globalRatings.filter((rating) => !ratings[rating])
        if (missingGlobal.length > 0) {
          setValidationError(t("feedback.validation.completeRequired", { defaultValue: "Veuillez compléter toutes les évaluations de cette section." }))
          return false
        }
        break
      case 2: // Progression & Apprentissage
        const progressRatings = ["skillImprovement"]
        const missingProgress = progressRatings.filter((rating) => !ratings[rating])
        if (missingProgress.length > 0) {
          setValidationError(t("sessions.skillImprovementRequired", { defaultValue: "Veuillez évaluer au moins l'amélioration des compétences." }))
          return false
        }
        break
      case 3: // Organisation & Logistique
        if (!formData.sessionDuration) {
          setValidationError(t("sessions.sessionDurationRequired", { defaultValue: "Veuillez indiquer votre avis sur la durée de la session." }))
          return false
        }
        break
      case 5: // Satisfaction & Recommandations
        if (!ratings.satisfactionLevel || !formData.wouldRecommend) {
          setValidationError(t("sessions.satisfactionRecommendationRequired", { defaultValue: "Veuillez compléter le niveau de satisfaction et la recommandation." }))
          return false
        }
        break
      case 7: // Commentaires Détaillés - optionnel
        break
      default:
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
      setValidationError(t("feedback.validation.completeRequired", { defaultValue: "Veuillez compléter toutes les évaluations obligatoires." }))
      return false
    }

    if (!formData.sessionDuration || !formData.wouldRecommend) {
      setValidationError(t("feedback.validation.completeRequired", { defaultValue: "Veuillez répondre à toutes les questions obligatoires." }))
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
        setValidationError(t("sessions.missingSessionId", { defaultValue: "ID de session manquant. Veuillez rafraîchir la page." }))
        setIsSubmitting(false)
        return
      }
      
      if (!userId) {
        setValidationError(t("auth.errorOccurred", { defaultValue: "Utilisateur non identifié. Veuillez vous reconnecter." }))
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
        detailedComments: {
          contentQuality: formData.contentQuality,
          trainerPerformance: formData.trainerPerformance,
          sessionOrganization: formData.sessionOrganization,
          learningMaterials: formData.learningMaterials,
          interactionLevel: formData.interactionLevel,
          technicalAspects: formData.technicalAspects,
        },
        commentCategories: formData.commentCategories,
        commentPriority: formData.commentPriority,
        feedback: formData.overallComments || "Feedback submitted via form",
        timestamp: new Date().toISOString(),
      }

      // Make API call via Axios instance (adds auth headers, baseURL)
      const { data: result } = await api.post('/feedback/session', feedbackData)
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
        contentQuality: "",
        trainerPerformance: "",
        sessionOrganization: "",
        learningMaterials: "",
        interactionLevel: "",
        technicalAspects: "",
      })

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000)
    } catch (error) {
      console.error("Error submitting feedback:", error)
      let errorMessage = t("feedback.errors.generic", { defaultValue: "Erreur lors de l'envoi du feedback. Veuillez réessayer." })
      
      if (error?.response) {
        const statusCode = error.response.status
        if (statusCode === 400) {
          errorMessage = t("feedback.errors.invalidData", { defaultValue: "Données invalides. Vérifiez que tous les champs requis sont remplis." })
        } else if (statusCode === 404) {
          errorMessage = t("sessions.loadError", { defaultValue: "Session ou utilisateur non trouvé. Rafraîchissez la page." })
        } else if (statusCode === 401) {
          errorMessage = t("auth.loginFailed", { defaultValue: "Authentification requise. Veuillez vous reconnecter." })
        } else if (statusCode === 500) {
          errorMessage = t("feedback.errors.serverError", { defaultValue: "Erreur serveur. Veuillez réessayer dans quelques instants." })
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
      case 0: // Guide des Évaluations
        return (
          <SectionCard
            headerStyle={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
            }}
            title={tr("sessions.guide", "Guide des Évaluations", "دليل التقييم")}
            subtitle={tr("sessions.guideSubtitle", "Comprendre le système de notation avec les emojis", "فهم نظام التقييم باستخدام الإيموجي")}
            icon="📖"
          >
            <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
              {tr("sessions.howToUseEmojis", "Comment utiliser les emojis pour évaluer ?", "كيف تستخدم الإيموجي للتقييم؟")}
            </Typography>
            
            <Grid container spacing={3}>
              {[
                {
                  emoji: "😞",
                  label: tr("sessions.ratingScaleVeryBad", "Très mauvais", "سيئ جدًا"),
                  color: "#f44336",
                  description: tr("sessions.veryDissatisfied", "Expérience très décevante, bien en dessous des attentes", "غير راضٍ جدًا")
                },
                {
                  emoji: "😐",
                  label: tr("sessions.ratingScaleBad", "Mauvais", "سيئ"),
                  color: "#ff9800",
                  description: tr("sessions.dissatisfied", "Expérience insatisfaisante, plusieurs aspects à améliorer", "غير راضٍ")
                },
                {
                  emoji: "🙂",
                  label: tr("sessions.ratingScaleAverage", "Moyen", "متوسط"),
                  color: "#ffc107",
                  description: tr("sessions.neutral", "Expérience correcte mais sans plus, quelques améliorations possibles", "محايد")
                },
                {
                  emoji: "😊",
                  label: tr("sessions.ratingScaleGood", "Bien", "جيد"),
                  color: "#4caf50",
                  description: tr("sessions.satisfied", "Bonne expérience, répond aux attentes avec quelques points forts", "راضٍ")
                },
                {
                  emoji: "🤩",
                  label: tr("sessions.ratingScaleExcellent", "Excellent", "ممتاز"),
                  color: "#2196f3",
                  description: tr("sessions.ratingExceptional", "Expérience exceptionnelle, dépasse largement les attentes", "استثنائي")
                }
              ].map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `2px solid ${item.color}40`,
                      bgcolor: `${item.color}10`,
                      textAlign: "center",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1
                    }}
                  >
                    <Typography sx={{ fontSize: "3rem" }}>{item.emoji}</Typography>
                    <Typography variant="h6" fontWeight="600" sx={{ color: item.color }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ mt: 4, p: 3, bgcolor: "info.light", borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                💡 <span>{tr("sessions.tipsTitle", "Conseils pour une évaluation efficace", "نصائح لتقييم فعّال")}</span>
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>{tr("sessions.tipHonest", "Soyez honnête :", "كن صادقاً:")}</strong> {tr("sessions.tipHonestDesc", "Votre feedback nous aide à améliorer nos formations", "يساعدنا رأيك في تحسين تدريباتنا")}
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>{tr("sessions.tipPrecise", "Soyez précis :", "كن دقيقاً:")}</strong> {tr("sessions.tipPreciseDesc", "Plus vos commentaires sont détaillés, plus ils sont utiles", "كلما كانت تعليقاتك مفصلة، كانت أكثر فائدة")}
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>{tr("sessions.tipConstructive", "Pensez constructif :", "كن بنّاءً:")}</strong> {tr("sessions.tipConstructiveDesc", "Proposez des améliorations concrètes", "اقترح تحسينات ملموسة")}
                </Typography>
                <Typography component="li" variant="body2">
                  <strong>{tr("sessions.tipTakeTime", "Prenez votre temps :", "خذ وقتك:")}</strong> {tr("sessions.tipTakeTimeDesc", "Réfléchissez à chaque aspect avant de noter", "فكر في كل جانب قبل التقييم")}
                </Typography>
              </Box>
            </Box>
          </SectionCard>
        )

      case 1: // Évaluation Globale
        return (
          <SectionCard
            headerStyle={{
              background: "linear-gradient(135deg, #1976d2, #1565c0)",
            }}
            title={tr("sessions.globalEvaluation", "Évaluation Globale de la Session", "التقييم العام للجلسة")}
            subtitle={tr("sessions.overallSessionRatingHelp", "Comment évaluez-vous l'ensemble de cette session de formation ?", "كيف تقيم هذه الجلسة التدريبية بشكل عام؟")}
            icon="⭐"
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.overallRating || 0}
                  onRatingChange={handleRatingChange}
                  label={`${tr("sessions.overallSessionRating", "Note globale de la session", "التقييم العام للجلسة")} *`}
                  description={tr("sessions.globalEvaluation", "Évaluation générale de votre expérience", "تقييم عام لتجربتك")}
                  ratingKey="overallRating"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.contentRelevance || 0}
                  onRatingChange={handleRatingChange}
                  label={`${tr("sessions.contentRelevance", "Pertinence du contenu", "ملاءمة المحتوى")} *`}
                  description={tr("sessions.contentRelevanceHelp", "Le contenu correspond-il à vos besoins ?", "هل يتوافق المحتوى مع احتياجاتك؟")}
                  ratingKey="contentRelevance"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.learningObjectives || 0}
                  onRatingChange={handleRatingChange}
                  label={`${tr("sessions.learningObjectives", "Atteinte des objectifs", "تحقيق الأهداف")} *`}
                  description={tr("sessions.objectivesAchieved", "Les objectifs annoncés ont-ils été atteints ?", "هل تم تحقيق الأهداف المعلنة؟")}
                  ratingKey="learningObjectives"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.sessionStructure || 0}
                  onRatingChange={handleRatingChange}
                  label={`${tr("sessions.sessionStructure", "Structure de la session", "هيكل الجلسة")} *`}
                  description={tr("sessions.sessionStructureHelp", "Organisation et progression logique", "التنظيم والتسلسل المنطقي")}
                  ratingKey="sessionStructure"
                />
              </Grid>
            </Grid>
          </SectionCard>
        )

      case 2: // Progression et Apprentissage
        return (
          <SectionCard
            headerStyle={{
              background: "linear-gradient(135deg, #388e3c, #2e7d32)",
            }}
            title={tr("sessions.progressionAndLearning", "Progression et Apprentissage", "التقدّم والتعلّم")}
            subtitle={tr("sessions.progressionAndLearningHelp", "Évaluez votre progression et les acquis de cette formation", "قيّم تقدمك وما اكتسبته")}
            icon="📈"
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.skillImprovement || 0}
                  onRatingChange={handleRatingChange}
                  label={`${tr("sessions.skillImprovement", "Amélioration des compétences", "تحسين المهارات")} *`}
                  description={tr("sessions.skillImprovementHelp", "Vos compétences se sont-elles développées ?", "هل تطورت مهاراتك؟")}
                  ratingKey="skillImprovement"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.knowledgeGain || 0}
                  onRatingChange={handleRatingChange}
                  label={tr("sessions.knowledgeGain", "Acquisition de connaissances", "اكتساب المعرفة")}
                  description={tr("sessions.knowledgeGainHelp", "Avez-vous appris de nouvelles choses ?", "هل تعلمت أشياء جديدة؟")}
                  ratingKey="knowledgeGain"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.practicalApplication || 0}
                  onRatingChange={handleRatingChange}
                  label={tr("sessions.practicalApplication", "Application pratique", "تطبيق عملي")}
                  description={tr("sessions.practicalApplicationHelp", "Pouvez-vous appliquer ce que vous avez appris ?", "هل يمكنك تطبيق ما تعلمته؟")}
                  ratingKey="practicalApplication"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.confidenceLevel || 0}
                  onRatingChange={handleRatingChange}
                  label={tr("sessions.confidenceLevel", "Niveau de confiance", "مستوى الثقة")}
                  description={tr("sessions.confidenceLevelHelp", "Vous sentez-vous plus confiant dans ce domaine ?", "هل تشعر بثقة أكبر في هذا المجال؟")}
                  ratingKey="confidenceLevel"
                />
              </Grid>
            </Grid>
          </SectionCard>
        )

      case 3: // Organisation et Logistique
        return (
          <SectionCard
            headerStyle={{
              background: "linear-gradient(135deg, #0288d1, #0277bd)",
            }}
            title={tr("sessions.organizationAndLogistics", "Organisation et Logistique", "التنظيم واللوجستيات")}
            subtitle={tr("sessions.organizationAndLogisticsHelp", "Comment évaluez-vous l'organisation pratique de la session ?", "كيف تقيّم التنظيم العملي للجلسة؟")}
            icon="📅"
          >
            <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
              <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                ⏰ {`${tr("sessions.sessionDuration", "Durée de la session", "مدة الجلسة")} *`}
              </FormLabel>
              <RadioGroup
                value={formData.sessionDuration}
                onChange={(e) => handleInputChange("sessionDuration", e.target.value)}
                row
              >
                <FormControlLabel value="trop-courte" control={<Radio />} label={`⏱️ ${tr("sessions.sessionDurationShort", "Trop courte", "قصيرة جدًا")}`} />
                <FormControlLabel value="parfaite" control={<Radio />} label={`✅ ${tr("sessions.sessionDurationPerfect", "Parfaite", "مثالية")}`} />
                <FormControlLabel value="trop-longue" control={<Radio />} label={`⏳ ${tr("sessions.sessionDurationLong", "Trop longue", "طويلة جدًا")}`} />
              </RadioGroup>
            </FormControl>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.pacing || 0}
                  onRatingChange={handleRatingChange}
                  label={tr("sessions.trainingPace", "Rythme de la formation", "وتيرة التدريب")}
                  description={tr("sessions.trainingPaceHelp", "Le rythme était-il adapté ?", "هل كانت الوتيرة مناسبة؟")}
                  ratingKey="pacing"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.environment || 0}
                  onRatingChange={handleRatingChange}
                  label={tr("sessions.trainingEnvironment", "Environnement de formation", "بيئة التدريب")}
                  description={tr("sessions.trainingEnvironmentHelp", "Lieu, ambiance, conditions matérielles", "المكان والأجواء والتجهيزات")}
                  ratingKey="environment"
                />
              </Grid>
            </Grid>
          </SectionCard>
        )

      case 4: // Impact et Valeur
        return (
          <SectionCard
            headerStyle={{
              background: "linear-gradient(135deg, #f57c00, #ef6c00)",
            }}
            title={tr("sessions.impactAndValue", "Impact et Valeur de la Formation", "الأثر والقيمة")}
            subtitle={tr("sessions.impactAndValueHelp", "Quel est l'impact de cette formation sur votre parcours professionnel ?", "ما أثر هذا التدريب على مسارك المهني؟")}
            icon="💼"
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.careerImpact || 0}
                  onRatingChange={handleRatingChange}
                  label={tr("sessions.careerImpact", "Impact sur votre carrière", "الأثر على مسارك المهني")}
                  description={tr("sessions.careerImpactHelp", "Cette formation vous aidera-t-elle professionnellement ?", "هل سيساعدك هذا التدريب مهنياً؟")}
                  ratingKey="careerImpact"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.applicability || 0}
                  onRatingChange={handleRatingChange}
                  label={tr("sessions.immediateApplicability", "Applicabilité immédiate", "قابلية التطبيق الفوري")}
                  description={tr("sessions.immediateApplicabilityHelp", "Pouvez-vous utiliser ces acquis rapidement ?", "هل يمكنك استخدام هذه المعارف سريعاً؟")}
                  ratingKey="applicability"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.valueForTime || 0}
                  onRatingChange={handleRatingChange}
                  label={tr("sessions.valueForTime", "Rapport qualité/temps", "القيمة مقابل الوقت")}
                  description={tr("sessions.valueForTimeHelp", "Le temps investi en valait-il la peine ?", "هل كان الوقت المستثمر يستحق ذلك؟")}
                  ratingKey="valueForTime"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <EmojiRating
                  rating={ratings.expectationsMet || 0}
                  onRatingChange={handleRatingChange}
                  label={tr("sessions.expectationsMet", "Attentes satisfaites", "تم تلبية التوقعات")}
                  description={tr("sessions.expectationsMetHelp", "Vos attentes initiales ont-elles été comblées ?", "هل تم تلبية توقعاتك الأولية؟")}
                  ratingKey="expectationsMet"
                />
              </Grid>
            </Grid>
          </SectionCard>
        )

      case 5: // Satisfaction et Recommandations
        return (
          <SectionCard
            headerStyle={{
              background: "linear-gradient(135deg, #424242, #303030)",
            }}
            title={tr("sessions.satisfactionAndRecommendations", "Satisfaction et Recommandations", "الرضا والتوصيات")}
            subtitle={tr("sessions.choicesAndRecommendations", "Votre niveau de satisfaction et vos recommandations", "مستوى رضاك وتوصياتك")}
            icon="👍"
          >
            <Box sx={{ mb: 3 }}>
              <EmojiRating
                rating={ratings.satisfactionLevel || 0}
                onRatingChange={handleRatingChange}
                label={`${tr("sessions.overallSatisfactionLevel", "Niveau de satisfaction global", "مستوى الرضا العام")} *`}
                description={tr("sessions.satisfactionHelp", "À quel point êtes-vous satisfait de cette session ?", "ما مدى رضاك عن هذه الجلسة؟")}
                ratingKey="satisfactionLevel"
              />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                    🤔 {`${tr("sessions.wouldYouRecommendTraining", "Recommanderiez-vous cette formation ?", "هل توصي بهذا التدريب؟")} *`}
                  </FormLabel>
                  <RadioGroup
                    value={formData.wouldRecommend}
                    onChange={(e) => handleInputChange("wouldRecommend", e.target.value)}
                  >
                    <FormControlLabel value="absolument" control={<Radio />} label={`🌟 ${tr("sessions.recommendAbsolutely", "Absolument", "بالتأكيد")}`} />
                    <FormControlLabel value="probablement" control={<Radio />} label={`👍 ${tr("sessions.recommendProbably", "Probablement", "على الأرجح")}`} />
                    <FormControlLabel value="peut-etre" control={<Radio />} label={`🤷 ${tr("sessions.recommendMaybe", "Peut-être", "ربما")}`} />
                    <FormControlLabel value="non" control={<Radio />} label={`👎 ${tr("sessions.recommendNo", "Non", "لا")}`} />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                    🔄 {tr("sessions.wouldYouAttendSimilarSession", "Participeriez-vous à une session similaire ?", "هل ستحضر جلسة مشابهة؟")}
                  </FormLabel>
                  <RadioGroup
                    value={formData.wouldAttendAgain}
                    onChange={(e) => handleInputChange("wouldAttendAgain", e.target.value)}
                  >
                    <FormControlLabel value="oui" control={<Radio />} label={`😊 ${tr("sessions.attendYes", "Oui, avec plaisir", "نعم، بكل سرور")}`} />
                    <FormControlLabel value="selon-sujet" control={<Radio />} label={`📚 ${tr("sessions.attendDepends", "Selon le sujet", "حسب الموضوع")}`} />
                    <FormControlLabel value="non" control={<Radio />} label={`❌ ${tr("sessions.attendNo", "Non", "لا")}`} />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </SectionCard>
        )

      case 6: // Points Forts et Améliorations
        return (
          <SectionCard
            headerStyle={{
              background: "linear-gradient(135deg, #9c27b0, #7b1fa2)",
            }}
            title={tr("sessions.strengthsAndImprovements", "Points Forts et Axes d'Amélioration", "نقاط القوة والتحسينات")}
            subtitle={tr("sessions.strengthsAndImprovementsHelp", "Identifiez les aspects les plus réussis et ceux à améliorer", "حدّد الجوانب الأكثر نجاحًا وتلك التي تحتاج للتحسين")}
            icon="💡"
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl component="fieldset" sx={{ width: "100%" }}>
                  <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                    ✨ {tr("sessions.strengths", "Points forts de la session", "نقاط القوة")}
                  </FormLabel>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {tr("sessions.multipleChoices", "(plusieurs choix possibles)", "(يمكن اختيار عدة خيارات)")}
                  </Typography>
                  <FormGroup>
                    {[
                      tr("sessions.qualityContent", "📚 Contenu de qualité", "📚 محتوى ذو جودة"),
                      tr("sessions.competentTrainer", "👨🏫 Formateur compétent", "👨🏫 مدرب كفء"),
                      tr("sessions.handsOnExercises", "💻 Exercices pratiques", "💻 تمارين عملية"),
                      tr("sessions.interaction", "🗣️ Interaction et échanges", "🗣️ تفاعل وتبادل"),
                      tr("sessions.learningMaterialsLabel", "📖 Support pédagogique", "📖 مواد تعليمية"),
                      tr("sessions.perfectOrganization", "⚡ Organisation parfaite", "⚡ تنظيم مثالي"),
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
                    🔧 {tr("sessions.improvementAreas", "Domaines à améliorer", "مجالات التحسين")}
                  </FormLabel>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {tr("sessions.multipleChoices", "(plusieurs choix possibles)", "(يمكن اختيار عدة خيارات)")}
                  </Typography>
                  <FormGroup>
                    {[
                      tr("sessions.moreInDepthContent", "📖 Contenu plus approfondi", "📖 محتوى أكثر عمقاً"),
                      tr("sessions.morePracticalExercises", "💻 Plus d'exercices pratiques", "💻 المزيد من التمارين العملية"),
                      tr("sessions.betterTimeManagement", "⏰ Meilleure gestion du temps", "⏰ إدارة وقت أفضل"),
                      tr("sessions.techSupport", "🔧 Support technique", "🔧 دعم تقني"),
                      tr("sessions.participantInteraction", "🤝 Interaction participante", "🤝 تفاعل المشاركين"),
                      tr("sessions.explanationsClarity", "💡 Clarté des explications", "💡 وضوح الشروحات"),
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

      case 7: // Commentaires Détaillés
        return (
          <Box sx={{ py: 2 }}>
            <TextField
              name="comment"
              label={`${tr("sessions.overallComment", "💭 Commentaire général", "💭 تعليق عام")} *`}
              multiline
              fullWidth
              rows={4}
              value={formData.overallComments}
              onChange={(e) => setFormData({ ...formData, overallComments: e.target.value })}
              required
              sx={{ mb: 3 }}
            />
           
          </Box>
        )

      default:
        return null
    }
  }

  const progress = (currentStep / steps.length) * 100

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
            📚 {t("sessions.sessionFeedback", { defaultValue: "Évaluation Complète de la Session" })}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            {tr("sessions.stepOf", "Étape", "الخطوة")} {currentStep + 1} {tr("sessions.of", "sur", "من")} {steps.length}: {steps[currentStep]}
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
                  {t("feedback.progressLabel", { defaultValue: "Progression" })}: {Math.round(progress)}%
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
              ✅ {t("sessions.submitSuccess", { defaultValue: "Merci pour votre évaluation complète ! Votre feedback nous aidera à améliorer nos futures sessions de formation." })}
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
          {t("common.back", { defaultValue: "Précédent" })}
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
            {isSubmitting
              ? t("feedback.actions.sending", { defaultValue: "Envoi en cours..." })
              : tr("sessions.sendEvaluation", "Envoyer l'Évaluation", "إرسال التقييم")}
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
            {t("common.next", { defaultValue: "Suivant" })}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default SessionFeedbackForm