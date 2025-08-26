export const parseJsonMaybe = (value) => {
  if (!value) return undefined;
  try {
    return typeof value === 'string' ? JSON.parse(value) : value;
  } catch (_e) {
    return undefined;
  }
};

export const computeWeightedRating = (source) => {
  if (!source) return 0;
  const average = source.averageRating;
  if (typeof average === 'number' && average > 0) return average;
  const ratings = parseJsonMaybe(source.ratings);
  if (ratings && typeof ratings === 'object') {
    const weights = {
      overallRating: 0.25,
      contentRelevance: 0.20,
      learningObjectives: 0.15,
      skillImprovement: 0.15,
      satisfactionLevel: 0.10,
      sessionStructure: 0.10,
      knowledgeGain: 0.05,
    };
    let total = 0;
    let w = 0;
    Object.entries(weights).forEach(([k, weight]) => {
      const val = ratings[k];
      if (typeof val === 'number' && val >= 1 && val <= 5) {
        total += val * weight;
        w += weight;
      }
    });
    if (w >= 0.5) return Math.round((total / w) * 10) / 10;
  }
  return typeof source.rating === 'number' ? source.rating : 0;
};

export const formatOneDecimal = (num) => {
  const rounded = Math.round(num * 10) / 10;
  return rounded.toFixed(1).replace('.', ',');
};

export const moodFromRating = (rating, t) => {
  const labels = [t('sessions.veryDissatisfied'), t('sessions.dissatisfied'), t('sessions.neutral'), t('sessions.satisfied'), t('sessions.verySatisfied')];
  const emojis = ['😞', '😐', '🙂', '😊', '🤩'];
  const r = Math.round(rating);
  const label = rating >= 4.5 ? labels[4]
    : rating >= 3.5 ? labels[3]
    : rating >= 2.5 ? labels[2]
    : rating >= 1.5 ? labels[1]
    : labels[0];
  const emoji = r >= 1 && r <= 5 ? emojis[r - 1] : '❓';
  return { label, emoji };
};

export const getEmojiForRating = (rating) => {
  const emojis = ['😞', '😐', '🙂', '😊', '🤩'];
  return rating > 0 && rating <= 5 ? emojis[rating - 1] : '❓';
};

export const getRatingLabel = (rating, t) => {
  const labels = [
    t('sessions.ratingScaleVeryBad'),
    t('sessions.ratingScaleBad'),
    t('sessions.ratingScaleAverage'),
    t('sessions.ratingScaleGood'),
    t('sessions.ratingScaleExcellent'),
  ];
  return rating > 0 && rating <= 5 ? labels[rating - 1] : t('sessions.notRated');
};

export const radioEmojiMap = {
  sessionDuration: { 'trop-courte': '⏱️', 'parfaite': '✅', 'trop-longue': '⏳' },
  wouldRecommend: { 'absolument': '🌟', 'probablement': '👍', 'peut-etre': '🤷', 'non': '👎' },
  wouldAttendAgain: { 'oui': '😊', 'selon-sujet': '📚', 'non': '❌' },
};

export const radioLabelMap = (t) => ({
  sessionDuration: {
    'trop-courte': t('sessions.sessionDurationShort'),
    'parfaite': t('sessions.sessionDurationPerfect'),
    'trop-longue': t('sessions.sessionDurationLong'),
  },
  wouldRecommend: {
    'absolument': t('sessions.recommendAbsolutely'),
    'probablement': t('sessions.recommendProbably'),
    'peut-etre': t('sessions.recommendMaybe'),
    'non': t('sessions.recommendNo'),
  },
  wouldAttendAgain: {
    'oui': t('sessions.attendYes'),
    'selon-sujet': t('sessions.attendDepends'),
    'non': t('sessions.attendNo'),
  },
});

export const scoreLabel = (score, t) => {
  if (score >= 4.5) return t('sessions.ratingExceptional');
  if (score >= 4.0) return t('sessions.ratingExcellent');
  if (score >= 3.5) return t('sessions.ratingVeryGood');
  if (score >= 3.0) return t('sessions.ratingGood');
  if (score >= 2.5) return t('sessions.ratingAverage');
  if (score >= 2.0) return t('sessions.ratingInsufficient');
  if (score > 0) return t('sessions.ratingVeryInsufficient');
  return t('sessions.notRated');
};