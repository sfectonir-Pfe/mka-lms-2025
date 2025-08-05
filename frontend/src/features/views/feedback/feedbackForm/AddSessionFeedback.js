import { useState } from "react";
import axios from "axios";
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
  Chip,
} from "@mui/material";
import { Close, Send, NavigateNext, NavigateBefore, Visibility } from "@mui/icons-material";

const AddSessionFeedback = ({ open, onClose, session }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [ratings, setRatings] = useState({});
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [showResponsesDialog, setShowResponsesDialog] = useState(false);

  const steps = [
    "Évaluation Globale",
    "Progression & Apprentissage",
    "Organisation & Logistique",
    "Impact & Valeur",
    "Satisfaction & Recommandations",
    "Points Forts & Améliorations",
    "Commentaires Détaillés",
  ];

  // Nouvelle fonction pour calculer le score pondéré
  const calculateWeightedScore = () => {
    // Définir les poids pour chaque critère (total = 1.0)
    const criteriaWeights = {
      overallRating: 0.25,        // 25% - Note globale
      contentRelevance: 0.20,     // 20% - Pertinence du contenu
      learningObjectives: 0.15,   // 15% - Atteinte des objectifs
      skillImprovement: 0.15,     // 15% - Amélioration des compétences
      satisfactionLevel: 0.10,    // 10% - Satisfaction
      sessionStructure: 0.10,     // 10% - Structure
      knowledgeGain: 0.05         // 5% - Acquisition de connaissances
    };

    let totalWeightedScore = 0;
    let totalWeight = 0;

    // Calculer le score pondéré
    Object.entries(criteriaWeights).forEach(([criterion, weight]) => {
      const rating = ratings[criterion];
      if (typeof rating === 'number' && rating >= 1 && rating <= 5) {
        totalWeightedScore += rating * weight;
        totalWeight += weight;
      }
    });

    // Si on a au moins 50% des critères pondérés évalués
    if (totalWeight >= 0.5) {
      return Math.round((totalWeightedScore / totalWeight) * 10) / 10;
    }

    return 0;
  };

  // Nouvelle fonction pour obtenir le label du score
  const getScoreLabel = (score) => {
    if (score >= 4.5) return 'Exceptionnel';
    if (score >= 4.0) return 'Excellent';
    if (score >= 3.5) return 'Très bien';
    if (score >= 3.0) return 'Bien';
    if (score >= 2.5) return 'Moyen';
    if (score >= 2.0) return 'Insuffisant';
    if (score > 0) return 'Très insuffisant';
    return 'Non évalué';
  };

  const EmojiRating = ({ rating, onRatingChange, label, description, ratingKey }) => {
    const emojis = ["😞", "😐", "🙂", "😊", "🤩"];
    const labels = ["1 - Très mauvais", "2 - Mauvais", "3 - Moyen", "4 - Bon", "5 - Excellent"];
    const colors = ["#f44336", "#ff9800", "#ffc107", "#4caf50", "#2196f3"];

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
              <Typography variant="caption" display="block" textAlign="center">
                {labels[index]}
              </Typography>
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
              {labels[rating - 1].split(" - ")[1]}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  const handleRatingChange = (ratingKey, value) => {
    setRatings((prev) => ({ ...prev, [ratingKey]: value }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field, value, checked) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? [...prev[field], value] : prev[field].filter((item) => item !== value),
    }));
  };

  const handleNext = () => {
    setValidationError("");
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setValidationError("");
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        const globalRatings = ["overallRating", "contentRelevance", "learningObjectives", "sessionStructure"];
        const missingGlobal = globalRatings.filter((rating) => !ratings[rating]);
        if (missingGlobal.length > 0) {
          setValidationError("Veuillez compléter toutes les évaluations de cette section.");
          return false;
        }
        break;
      case 1:
        if (!ratings.skillImprovement) {
          setValidationError("Veuillez évaluer l'amélioration des compétences.");
          return false;
        }
        break;
      case 2:
        if (!formData.sessionDuration) {
          setValidationError("Veuillez indiquer votre avis sur la durée de la session.");
          return false;
        }
        break;
      case 4:
        if (!ratings.satisfactionLevel || !formData.wouldRecommend) {
          setValidationError("Veuillez compléter le niveau de satisfaction et la recommandation.");
          return false;
        }
        break;
      default:
        // No validation needed for other steps
        break;
    }
    return true;
  };

  const validateForm = () => {
    const requiredRatings = [
      "overallRating",
      "contentRelevance",
      "learningObjectives",
      "sessionStructure",
      "skillImprovement",
      "satisfactionLevel",
    ];
    const missingRatings = requiredRatings.filter((rating) => !ratings[rating]);

    if (missingRatings.length > 0) {
      setValidationError("Veuillez compléter toutes les évaluations obligatoires.");
      return false;
    }

    if (!formData.sessionDuration || !formData.wouldRecommend) {
      setValidationError("Veuillez répondre à toutes les questions obligatoires.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Vérification des données requises
    const user = JSON.parse(localStorage.getItem("user"));
    const sessionId = session?.id;
    const userId = user?.id;

    console.log("Session data:", session);
    console.log("User data:", user);
    console.log("SessionId:", sessionId);
    console.log("UserId:", userId);

    if (!sessionId) {
      setValidationError("Erreur: ID de session manquant. Veuillez rafraîchir la page.");
      setIsSubmitting(false);
      return;
    }

    if (!userId) {
      setValidationError("Erreur: Utilisateur non connecté. Veuillez vous reconnecter.");
      setIsSubmitting(false);
      return;
    }

    const feedbackData = {
      sessionId: Number(sessionId),
      userId: Number(userId),
      rating: calculateWeightedScore(),
      feedback: formData.overallComments || "Feedback de session",
      sessionComments: formData.overallComments,
      trainerComments: formData.suggestions,
      teamComments: formData.bestAspects,
      suggestions: formData.improvementAreas?.join(", "),
      ratings,
      ...formData,
      comments: JSON.stringify({
        text: formData.overallComments,
        coordinates: formData.latitude && formData.longitude ? {
          latitude: formData.latitude,
          longitude: formData.longitude,
        } : undefined,
      }),
      timestamp: new Date().toISOString(),
    };

    console.log("Feedback data to send:", feedbackData);

    try {
      const response = await axios.post('http://localhost:8000/feedback/session', feedbackData);
      console.log("Feedback submitted successfully:", response.data);
      setShowSuccess(true);
      setIsSubmitting(false);

      setTimeout(() => {
        onClose();
        setCurrentStep(0);
      }, 2000);

      setRatings({});
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
      });

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      let errorMessage = "Une erreur est survenue lors de l'envoi du feedback. Veuillez réessayer.";

      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          errorMessage = "Erreur de validation: " + error.response.data.message.join(", ");
        } else {
          errorMessage = "Erreur: " + error.response.data.message;
        }
      } else if (error.response?.status === 400) {
        errorMessage = "Erreur de validation des données. Veuillez vérifier vos réponses.";
      } else if (error.response?.status === 500) {
        errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
      }

      setValidationError(errorMessage);
      setIsSubmitting(false);
    }
  };

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
  );

  // Composant pour afficher les réponses de l'étudiant
  const ResponsesDialog = ({ open, onClose }) => {
    const getEmojiForRating = (rating) => {
      const emojis = ["😞", "😐", "🙂", "😊", "🤩"];
      return rating > 0 && rating <= 5 ? emojis[rating - 1] : "❓";
    };

    const getRatingLabel = (rating) => {
      const labels = ["Très mauvais", "Mauvais", "Moyen", "Bon", "Excellent"];
      return rating > 0 && rating <= 5 ? labels[rating - 1] : "Non évalué";
    };

    const getRadioEmoji = (value, field) => {
      const emojiMap = {
        sessionDuration: {
          "trop-courte": "⏱️",
          "parfaite": "✅",
          "trop-longue": "⏳"
        },
        wouldRecommend: {
          "absolument": "🌟",
          "probablement": "👍",
          "peut-etre": "🤷",
          "non": "👎"
        },
        wouldAttendAgain: {
          "oui": "😊",
          "selon-sujet": "📚",
          "non": "❌"
        }
      };
      return emojiMap[field]?.[value] || "❓";
    };

    const getRadioLabel = (value, field) => {
      const labelMap = {
        sessionDuration: {
          "trop-courte": "Trop courte",
          "parfaite": "Parfaite",
          "trop-longue": "Trop longue"
        },
        wouldRecommend: {
          "absolument": "Absolument",
          "probablement": "Probablement",
          "peut-etre": "Peut-être",
          "non": "Non"
        },
        wouldAttendAgain: {
          "oui": "Oui, avec plaisir",
          "selon-sujet": "Selon le sujet",
          "non": "Non"
        }
      };
      return labelMap[field]?.[value] || "Non renseigné";
    };

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            maxHeight: "90vh",
            overflow: "auto",
            borderRadius: 3,
          }
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
              📋 Résumé des Réponses
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Aperçu de toutes vos évaluations
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {/* Évaluation moyenne */}
          <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'white' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                📊 Score Global Pondéré
              </Typography>
              <Typography variant="h2" fontWeight="bold">
                {calculateWeightedScore()}/5
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                {getScoreLabel(calculateWeightedScore())}
              </Typography>
            </CardContent>
          </Card>

          {/* Section 1: Évaluation Globale */}
          <Card sx={{ mb: 3 }}>
            <CardHeader
              sx={{ bgcolor: 'primary.light', color: 'white' }}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '1.2rem' }}>⭐</Typography>
                  <Typography variant="h6">Évaluation Globale</Typography>
                </Box>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                {[
                  { key: 'overallRating', label: 'Note globale de la session' },
                  { key: 'contentRelevance', label: 'Pertinence du contenu' },
                  { key: 'learningObjectives', label: 'Atteinte des objectifs' },
                  { key: 'sessionStructure', label: 'Structure de la session' }
                ].map(({ key, label }) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography sx={{ fontSize: '1.5rem' }}>
                        {getEmojiForRating(ratings[key])}
                      </Typography>
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getRatingLabel(ratings[key])}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Section 2: Progression et Apprentissage */}
          <Card sx={{ mb: 3 }}>
            <CardHeader
              sx={{ bgcolor: 'success.light', color: 'white' }}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '1.2rem' }}>📈</Typography>
                  <Typography variant="h6">Progression et Apprentissage</Typography>
                </Box>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                {[
                  { key: 'skillImprovement', label: 'Amélioration des compétences' },
                  { key: 'knowledgeGain', label: 'Acquisition de connaissances' },
                  { key: 'practicalApplication', label: 'Application pratique' },
                  { key: 'confidenceLevel', label: 'Niveau de confiance' }
                ].map(({ key, label }) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography sx={{ fontSize: '1.5rem' }}>
                        {getEmojiForRating(ratings[key])}
                      </Typography>
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getRatingLabel(ratings[key])}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Section 3: Organisation et Logistique */}
          <Card sx={{ mb: 3 }}>
            <CardHeader
              sx={{ bgcolor: 'info.light', color: 'white' }}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '1.2rem' }}>📅</Typography>
                  <Typography variant="h6">Organisation et Logistique</Typography>
                </Box>
              }
            />
            <CardContent>
              {/* Durée de la session */}
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography sx={{ fontSize: '1.2rem' }}>⏰</Typography>
                  <Typography variant="body1" fontWeight="600">
                    Durée de la session
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '1.5rem' }}>
                    {getRadioEmoji(formData.sessionDuration, 'sessionDuration')}
                  </Typography>
                  <Typography variant="body2">
                    {getRadioLabel(formData.sessionDuration, 'sessionDuration')}
                  </Typography>
                </Box>
              </Box>

              {/* Autres évaluations */}
              <Grid container spacing={2}>
                {[
                  { key: 'pacing', label: 'Rythme de la formation' },
                  { key: 'environment', label: 'Environnement de formation' }
                ].map(({ key, label }) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography sx={{ fontSize: '1.5rem' }}>
                        {getEmojiForRating(ratings[key])}
                      </Typography>
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getRatingLabel(ratings[key])}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Section 4: Impact et Valeur */}
          <Card sx={{ mb: 3 }}>
            <CardHeader
              sx={{ bgcolor: 'warning.light', color: 'white' }}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '1.2rem' }}>💼</Typography>
                  <Typography variant="h6">Impact et Valeur</Typography>
                </Box>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                {[
                  { key: 'careerImpact', label: 'Impact sur votre carrière' },
                  { key: 'applicability', label: 'Applicabilité immédiate' },
                  { key: 'valueForTime', label: 'Rapport qualité/temps' },
                  { key: 'expectationsMet', label: 'Attentes satisfaites' }
                ].map(({ key, label }) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography sx={{ fontSize: '1.5rem' }}>
                        {getEmojiForRating(ratings[key])}
                      </Typography>
                      <Box>
                        <Typography variant="body2" fontWeight="600">
                          {label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getRatingLabel(ratings[key])}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Section 5: Satisfaction et Recommandations */}
          <Card sx={{ mb: 3 }}>
            <CardHeader
              sx={{ bgcolor: 'grey.700', color: 'white' }}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '1.2rem' }}>👍</Typography>
                  <Typography variant="h6">Satisfaction et Recommandations</Typography>
                </Box>
              }
            />
            <CardContent>
              {/* Satisfaction globale */}
              <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography sx={{ fontSize: '1.2rem' }}>😊</Typography>
                  <Typography variant="body1" fontWeight="600">
                    Niveau de satisfaction global
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '1.5rem' }}>
                    {getEmojiForRating(ratings.satisfactionLevel)}
                  </Typography>
                  <Typography variant="body2">
                    {getRatingLabel(ratings.satisfactionLevel)}
                  </Typography>
                </Box>
              </Box>

              {/* Recommandations */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography sx={{ fontSize: '1.2rem' }}>🤔</Typography>
                      <Typography variant="body1" fontWeight="600">
                        Recommanderiez-vous cette formation ?
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontSize: '1.5rem' }}>
                        {getRadioEmoji(formData.wouldRecommend, 'wouldRecommend')}
                      </Typography>
                      <Typography variant="body2">
                        {getRadioLabel(formData.wouldRecommend, 'wouldRecommend')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography sx={{ fontSize: '1.2rem' }}>🔄</Typography>
                      <Typography variant="body1" fontWeight="600">
                        Participeriez-vous à une session similaire ?
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography sx={{ fontSize: '1.5rem' }}>
                        {getRadioEmoji(formData.wouldAttendAgain, 'wouldAttendAgain')}
                      </Typography>
                      <Typography variant="body2">
                        {getRadioLabel(formData.wouldAttendAgain, 'wouldAttendAgain')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Section 6: Points Forts et Améliorations */}
          <Card sx={{ mb: 3 }}>
            <CardHeader
              sx={{ bgcolor: 'secondary.light', color: 'white' }}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '1.2rem' }}>💡</Typography>
                  <Typography variant="h6">Points Forts et Améliorations</Typography>
                </Box>
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1, color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography sx={{ fontSize: '1.2rem' }}>✨</Typography>
                      <Typography variant="h6" fontWeight="600">
                        Points forts
                      </Typography>
                    </Box>
                    {formData.strongestAspects.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {formData.strongestAspects.map((aspect, index) => (
                          <Chip
                            key={index}
                            label={aspect}
                            size="small"
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Aucun point fort sélectionné
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1, color: 'white' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography sx={{ fontSize: '1.2rem' }}>🔧</Typography>
                      <Typography variant="h6" fontWeight="600">
                        Domaines à améliorer
                      </Typography>
                    </Box>
                    {formData.improvementAreas.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {formData.improvementAreas.map((area, index) => (
                          <Chip
                            key={index}
                            label={area}
                            size="small"
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Aucun domaine d'amélioration sélectionné
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Section 7: Commentaires */}
          <Card sx={{ mb: 3 }}>
            <CardHeader
              sx={{ bgcolor: 'primary.dark', color: 'white' }}
              title={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '1.2rem' }}>💬</Typography>
                  <Typography variant="h6">Commentaires Détaillés</Typography>
                </Box>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                {[
                  { key: 'overallComments', label: '💭 Commentaire général', emoji: '💭' },
                  { key: 'bestAspects', label: '⭐ Ce que vous avez le plus apprécié', emoji: '⭐' },
                  { key: 'suggestions', label: '💡 Suggestions d\'amélioration', emoji: '💡' },
                  { key: 'additionalTopics', label: '📚 Sujets supplémentaires souhaités', emoji: '📚' }
                ].map(({ key, label, emoji }) => (
                  <Grid item xs={12} key={key}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography sx={{ fontSize: '1.2rem' }}>{emoji}</Typography>
                        <Typography variant="body1" fontWeight="600">
                          {label}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {formData[key] || "Aucun commentaire fourni"}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="contained" color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
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
        );

      case 1:
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
        );

      case 2:
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
        );

      case 3:
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
        );

      case 4:
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
        );

      case 5:
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
        );

      case 6:
        return (
          <SectionCard
            headerStyle={{
              background: "linear-gradient(135deg, #1976d2, #1565c0)",
            }}
            title="Commentaires Détaillés"
            subtitle="Partagez vos impressions et suggestions en détail"
            icon="💬"
          >
            {/* Affichage de la note moyenne */}
            <Box sx={{ 
              mb: 3,
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              textAlign: 'center'
            }}>
              <Typography variant="h6" gutterBottom>
                Votre score global pondéré
              </Typography>
              <Typography variant="h2" fontWeight="bold" sx={{ mb: 1 }}>
                {calculateWeightedScore()}/5
              </Typography>
              <Typography variant="subtitle1" sx={{ fontStyle: 'italic', mb: 2 }}>
                {getScoreLabel(calculateWeightedScore())}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '2.5rem',
                      color: i < Math.round(calculateWeightedScore()) ? '#ffc107' : '#e0e0e0'
                    }}
                  >
                    {i < calculateWeightedScore() ? '★' : '☆'}
                  </span>
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Basée sur {Object.values(ratings).filter(r => typeof r === 'number' && r >= 1 && r <= 5).length} évaluations
              </Typography>
            </Box>

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
        );

      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

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

        {/* Bouton pour voir les réponses */}
        <Button
          onClick={() => setShowResponsesDialog(true)}
          variant="outlined"
          startIcon={<Visibility />}
          size="large"
          sx={{ mr: 'auto' }}
        >
          Voir mes réponses
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
            onClick={handleNext}
            variant="contained"
            endIcon={<NavigateNext />}
            size="large"
          >
            Suivant
          </Button>
        )}
      </DialogActions>

      {/* Dialog pour afficher les réponses */}
      <ResponsesDialog
        open={showResponsesDialog}
        onClose={() => setShowResponsesDialog(false)}
      />
    </Dialog>
  );
};

export default AddSessionFeedback;