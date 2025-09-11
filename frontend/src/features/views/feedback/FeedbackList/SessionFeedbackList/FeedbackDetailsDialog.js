import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography, Grid } from '@mui/material';
import { Close as CloseIcon, Feedback as FeedbackIcon } from '@mui/icons-material';
import { parseJsonMaybe, computeWeightedRating, scoreLabel } from './utils';
import { SectionCard, RatingsGrid, ChoiceRow, ChipsBox, CommentBlock } from './FeedbackSections';

export const FeedbackDetailsDialog = ({ open, onClose, t, items }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{ '& .MuiDialog-paper': { borderRadius: 3 } }}>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FeedbackIcon fontSize="large" />
          <Box>
            <Typography variant="h5" fontWeight="bold">{t('sessions.feedbackDetails')}</Typography>
            {items.length > 0 && (
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {items[0]?.studentName || items[0]?.studentEmail}
                {items[0]?.studentName && items[0]?.studentEmail && ` (${items[0]?.studentEmail})`}
              </Typography>
            )}
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'primary.contrastText' }} size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {items.length > 0 ? (
          <Stack spacing={3}>
            {items.map((fb) => {
              const formData = parseJsonMaybe(fb.formData) || {};
              const ratings = parseJsonMaybe(fb.ratings) || {};
              const weighted = computeWeightedRating(fb);

              return (
                <Box key={fb.id}>
                  <SectionCard color="primary.main" icon="📊" title={t('sessions.weightedGlobalScore')}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h2" fontWeight="bold">{weighted}/5</Typography>
                      <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>{scoreLabel(weighted, t)}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ fontSize: '2.5rem', color: i < Math.round(weighted) ? '#ffc107' : '#e0e0e0' }}>
                            {i < weighted ? '★' : '☆'}
                          </span>
                        ))}
                      </Box>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        {t('sessions.basedOnWeightedCriteria', { count: Object.values(ratings).filter((r) => typeof r === 'number' && r >= 1 && r <= 5).length })}
                      </Typography>
                    </Box>
                  </SectionCard>

                  {(ratings.overallRating || ratings.contentRelevance || ratings.learningObjectives || ratings.sessionStructure) && (
                    <SectionCard color="primary.light" icon="⭐" title={t('sessions.globalEvaluation')}>
                      <RatingsGrid
                        t={t}
                        ratings={ratings}
                        items={[
                          { key: 'overallRating', label: t('sessions.overallSessionRating') },
                          { key: 'contentRelevance', label: t('sessions.contentRelevance') },
                          { key: 'learningObjectives', label: t('sessions.learningObjectives') },
                          { key: 'sessionStructure', label: t('sessions.sessionStructure') },
                        ]}
                      />
                    </SectionCard>
                  )}

                  {(ratings.skillImprovement || ratings.knowledgeGain || ratings.practicalApplication || ratings.confidenceLevel) && (
                    <SectionCard color="success.light" icon="📈" title={t('sessions.progressionAndLearning')}>
                      <RatingsGrid
                        t={t}
                        ratings={ratings}
                        items={[
                          { key: 'skillImprovement', label: t('sessions.skillImprovement') },
                          { key: 'knowledgeGain', label: t('sessions.knowledgeGain') },
                          { key: 'practicalApplication', label: t('sessions.practicalApplication') },
                          { key: 'confidenceLevel', label: t('sessions.confidenceLevel') },
                        ]}
                      />
                    </SectionCard>
                  )}

                  {((ratings.pacing || ratings.environment) || formData.sessionDuration) && (
                    <SectionCard color="info.light" icon="📅" title={t('sessions.organizationAndLogistics')}>
                      {formData.sessionDuration && (
                        <Box sx={{ mb: 2 }}>
                          <ChoiceRow icon="⏰" label={t('sessions.sessionDuration')} value={formData.sessionDuration} field="sessionDuration" t={t} />
                        </Box>
                      )}
                      <RatingsGrid
                        t={t}
                        ratings={ratings}
                        items={[
                          { key: 'pacing', label: t('sessions.trainingPace') },
                          { key: 'environment', label: t('sessions.trainingEnvironment') },
                        ]}
                      />
                    </SectionCard>
                  )}

                  {(ratings.careerImpact || ratings.applicability || ratings.valueForTime || ratings.expectationsMet) && (
                    <SectionCard color="warning.light" icon="💼" title={t('sessions.impactAndValue')}>
                      <RatingsGrid
                        t={t}
                        ratings={ratings}
                        items={[
                          { key: 'careerImpact', label: t('sessions.careerImpact') },
                          { key: 'applicability', label: t('sessions.immediateApplicability') },
                          { key: 'valueForTime', label: t('sessions.valueForTime') },
                          { key: 'expectationsMet', label: t('sessions.expectationsMet') },
                        ]}
                      />
                    </SectionCard>
                  )}

                  {((ratings && ratings.satisfactionLevel) || formData.wouldRecommend || formData.wouldAttendAgain) && (
                    <SectionCard color="grey.700" icon="👍" title={t('sessions.satisfactionAndRecommendations')}>
                      <RatingsGrid
                        t={t}
                        ratings={ratings}
                        items={[{ key: 'satisfactionLevel', label: t('sessions.overallSatisfactionLevel') }]}
                      />
                      <Grid container spacing={2}>
                        {formData.wouldRecommend && (
                          <Grid item xs={12} sm={6}>
                            <ChoiceRow icon="🤔" label={t('sessions.wouldYouRecommendTraining')} value={formData.wouldRecommend} field="wouldRecommend" t={t} />
                          </Grid>
                        )}
                        {formData.wouldAttendAgain && (
                          <Grid item xs={12} sm={6}>
                            <ChoiceRow icon="🔄" label={t('sessions.wouldYouAttendSimilarSession')} value={formData.wouldAttendAgain} field="wouldAttendAgain" t={t} />
                          </Grid>
                        )}
                      </Grid>
                    </SectionCard>
                  )}

                  {(formData.strongestAspects?.length > 0 || formData.improvementAreas?.length > 0) && (
                    <SectionCard color="secondary.light" icon="💡" title={t('sessions.strengthsAndImprovements')}>
                      <Grid container spacing={3}>
                        {formData.strongestAspects?.length > 0 && (
                          <Grid item xs={12} md={6}>
                            <ChipsBox title={t('sessions.strengths')} icon="✨" values={formData.strongestAspects} color="success.light" invert />
                          </Grid>
                        )}
                        {formData.improvementAreas?.length > 0 && (
                          <Grid item xs={12} md={6}>
                            <ChipsBox title={t('sessions.improvementAreas')} icon="🔧" values={formData.improvementAreas} />
                          </Grid>
                        )}
                      </Grid>
                    </SectionCard>
                  )}

                  {(formData.overallComments || formData.bestAspects || formData.suggestions || formData.additionalTopics) && (
                    <SectionCard color="primary.dark" icon="💬" title={t('sessions.detailedComments')}>
                      <Grid container spacing={2}>
                        {[
                          { key: 'overallComments', title: t('sessions.overallComment'), icon: '💭' },
                          { key: 'bestAspects', title: t('sessions.bestAspects'), icon: '⭐' },
                          { key: 'suggestions', title: t('sessions.improvementSuggestions'), icon: '💡' },
                          { key: 'additionalTopics', title: t('sessions.additionalDesiredTopics'), icon: '📚' },
                        ].filter(({ key }) => formData[key]).map(({ key, title, icon }) => (
                          <Grid item xs={12} key={key}>
                            <CommentBlock icon={icon} title={title} text={formData[key]} />
                          </Grid>
                        ))}
                      </Grid>
                    </SectionCard>
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">{t('sessions.noFeedbackSelected')}</Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: 'background.default' }}>
        <Button onClick={onClose} variant="outlined" color="primary">{t('sessions.close')}</Button>
      </DialogActions>
    </Dialog>
  );
};