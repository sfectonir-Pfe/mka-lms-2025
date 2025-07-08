import React, { useState } from 'react';
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
  Rating,
  Box,
  Grid
} from '@mui/material';
import {
  Star,
  Send,
  Person,
  Group,
  MenuBook
} from '@mui/icons-material';



const StarRating = ({ rating, onRatingChange, label }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography component="legend" gutterBottom>
        {label}
      </Typography>
      <Rating
        value={rating}
        onChange={(event, newValue) => onRatingChange(newValue)}
        size="large"
      />
    </Box>
  );
};

export default function FormationFeedback() {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Feedback soumis:", feedback)
    alert("Merci pour votre feedback ! Vos commentaires ont été enregistrés.")
  }

  const handleImprovementAreaChange = (area, checked) => {
    setFeedback((prev) => ({
      ...prev,
      improvementAreas: checked ? [...prev.improvementAreas, area] : prev.improvementAreas.filter((a) => a !== area),
    }))
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50', p: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Formulaire de Feedback - Séance de Formation
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Votre avis nous aide à améliorer la qualité de nos formations
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Évaluation du déroulement */}
          <Card sx={{ p: 3 }}>
            <CardHeader>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <MenuBook />
                Évaluation du Déroulement de la Séance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comment évaluez-vous le contenu et l'organisation de la séance ?
              </Typography>
            </CardHeader>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <StarRating
                    rating={feedback.sessionRating}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, sessionRating: rating }))}
                    label="Note globale de la séance"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StarRating
                    rating={feedback.contentQuality}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, contentQuality: rating }))}
                    label="Qualité du contenu"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StarRating
                    rating={feedback.sessionOrganization}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, sessionOrganization: rating }))}
                    label="Organisation de la séance"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StarRating
                    rating={feedback.objectivesAchieved}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, objectivesAchieved: rating }))}
                    label="Objectifs atteints"
                  />
                </Grid>
              </Grid>

              <FormControl component="fieldset" sx={{ mt: 3 }}>
                <FormLabel component="legend">Durée de la séance</FormLabel>
                <RadioGroup
                  value={feedback.sessionDuration}
                  onChange={(e) => setFeedback((prev) => ({ ...prev, sessionDuration: e.target.value }))}
                  row
                >
                  <FormControlLabel value="trop-courte" control={<Radio />} label="Trop courte" />
                  <FormControlLabel value="adequate" control={<Radio />} label="Adéquate" />
                  <FormControlLabel value="trop-longue" control={<Radio />} label="Trop longue" />
                </RadioGroup>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Commentaires sur la séance"
                value={feedback.sessionComments}
                onChange={(e) => setFeedback((prev) => ({ ...prev, sessionComments: e.target.value }))}
                placeholder="Partagez vos impressions sur le déroulement de la séance..."
                sx={{ mt: 3 }}
              />
            </CardContent>
          </Card>

          {/* Évaluation du formateur */}
          <Card sx={{ p: 3 }}>
            <CardHeader>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Person />
                Évaluation du Formateur
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comment évaluez-vous les compétences et l'approche du formateur ?
              </Typography>
            </CardHeader>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <StarRating
                    rating={feedback.trainerRating}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, trainerRating: rating }))}
                    label="Note globale du formateur"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StarRating
                    rating={feedback.trainerClarity}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, trainerClarity: rating }))}
                    label="Clarté des explications"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StarRating
                    rating={feedback.trainerPedagogy}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, trainerPedagogy: rating }))}
                    label="Approche pédagogique"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StarRating
                    rating={feedback.trainerAvailability}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, trainerAvailability: rating }))}
                    label="Disponibilité et écoute"
                  />
                </Grid>
              </Grid>

              <StarRating
                rating={feedback.trainerInteraction}
                onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, trainerInteraction: rating }))}
                label="Interaction avec les étudiants"
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Commentaires sur le formateur"
                value={feedback.trainerComments}
                onChange={(e) => setFeedback((prev) => ({ ...prev, trainerComments: e.target.value }))}
                placeholder="Partagez vos impressions sur le formateur..."
                sx={{ mt: 3 }}
              />
            </CardContent>
          </Card>

          {/* Évaluation de l'équipe */}
          <Card sx={{ p: 3 }}>
            <CardHeader>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Group />
                Évaluation de l'Équipe d'Étudiants
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Comment évaluez-vous la collaboration et la participation de votre équipe ?
              </Typography>
            </CardHeader>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <StarRating
                    rating={feedback.teamRating}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, teamRating: rating }))}
                    label="Note globale de l'équipe"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StarRating
                    rating={feedback.teamCollaboration}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, teamCollaboration: rating }))}
                    label="Esprit de collaboration"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StarRating
                    rating={feedback.teamParticipation}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, teamParticipation: rating }))}
                    label="Niveau de participation"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <StarRating
                    rating={feedback.teamCommunication}
                    onRatingChange={(rating) => setFeedback((prev) => ({ ...prev, teamCommunication: rating }))}
                    label="Qualité de la communication"
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Commentaires sur l'équipe"
                value={feedback.teamComments}
                onChange={(e) => setFeedback((prev) => ({ ...prev, teamComments: e.target.value }))}
                placeholder="Partagez vos impressions sur le travail d'équipe..."
                sx={{ mt: 3 }}
              />
            </CardContent>
          </Card>

          {/* Recommandations et suggestions */}
          <Card sx={{ p: 3 }}>
            <CardHeader>
              <Typography variant="h6" gutterBottom>
                Recommandations et Suggestions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aidez-nous à améliorer nos formations
              </Typography>
            </CardHeader>
            <CardContent>
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend">Recommanderiez-vous cette formation ?</FormLabel>
                <RadioGroup
                  value={feedback.wouldRecommend}
                  onChange={(e) => setFeedback((prev) => ({ ...prev, wouldRecommend: e.target.value }))}
                >
                  <FormControlLabel value="oui" control={<Radio />} label="Oui, certainement" />
                  <FormControlLabel value="peut-etre" control={<Radio />} label="Peut-être" />
                  <FormControlLabel value="non" control={<Radio />} label="Non" />
                </RadioGroup>
              </FormControl>

              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend">Domaines d'amélioration (plusieurs choix possibles)</FormLabel>
                <FormGroup>
                  <Grid container>
                    {[
                      "Contenu du cours",
                      "Méthodes pédagogiques",
                      "Support de cours",
                      "Exercices pratiques",
                      "Gestion du temps",
                      "Interaction avec les étudiants",
                      "Environnement de formation",
                      "Outils techniques",
                    ].map((area) => (
                      <Grid item xs={12} sm={6} key={area}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={feedback.improvementAreas.includes(area)}
                              onChange={(e) => handleImprovementAreaChange(area, e.target.checked)}
                            />
                          }
                          label={area}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </FormGroup>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Suggestions d'amélioration"
                value={feedback.suggestions}
                onChange={(e) => setFeedback((prev) => ({ ...prev, suggestions: e.target.value }))}
                placeholder="Quelles améliorations suggérez-vous pour les prochaines formations ?"
              />
            </CardContent>
          </Card>

          {/* Bouton de soumission */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<Send />}
              sx={{ px: 4 }}
            >
              Envoyer le Feedback
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
