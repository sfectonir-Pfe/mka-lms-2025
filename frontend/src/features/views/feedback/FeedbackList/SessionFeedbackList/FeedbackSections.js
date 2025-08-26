import React from 'react';
import { Box, Card, CardContent, CardHeader, Chip, Grid, Typography } from '@mui/material';
import { getEmojiForRating, getRatingLabel, radioEmojiMap, radioLabelMap } from './utils';

export const SectionCard = ({ color, icon, title, children }) => (
  <Card sx={{ mb: 3 }}>
    <CardHeader sx={{ bgcolor: color, color: 'white' }} title={
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: '1.2rem' }}>{icon}</Typography>
        <Typography variant="h6">{title}</Typography>
      </Box>
    } />
    <CardContent>{children}</CardContent>
  </Card>
);

export const RatingsGrid = ({ items, ratings, t }) => (
  <Grid container spacing={2}>
    {items.filter(({ key }) => ratings[key]).map(({ key, label }) => (
      <Grid item xs={12} sm={6} key={key}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography sx={{ fontSize: '1.5rem' }}>{getEmojiForRating(ratings[key])}</Typography>
          <Box>
            <Typography variant="body2" fontWeight="600">{label}</Typography>
            <Typography variant="caption" color="text.secondary">{getRatingLabel(ratings[key], t)}</Typography>
          </Box>
        </Box>
      </Grid>
    ))}
  </Grid>
);

export const ChoiceRow = ({ icon, label, value, field, t }) => {
  const labels = radioLabelMap(t);
  return (
    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography sx={{ fontSize: '1.2rem' }}>{icon}</Typography>
        <Typography variant="body1" fontWeight="600">{label}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: '1.5rem' }}>{radioEmojiMap[field]?.[value] || '❓'}</Typography>
        <Typography variant="body2">{labels[field]?.[value] || t('notProvided')}</Typography>
      </Box>
    </Box>
  );
};

export const ChipsBox = ({ title, icon, values, color = 'white', invert = false }) => (
  <Box sx={{ p: 2, bgcolor: color, borderRadius: 1, color: invert ? 'white' : 'black', border: invert ? undefined : '2px solid #e0e0e0' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Typography sx={{ fontSize: '1.2rem' }}>{icon}</Typography>
      <Typography variant="h6" fontWeight="600">{title}</Typography>
    </Box>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {values.map((v, i) => (
        <Chip key={i} label={v} size="small" sx={invert ? { bgcolor: 'rgba(255,255,255,0.2)', color: 'white' } : { bgcolor: '#f5f5f5', color: 'black', border: '1px solid #ddd' }} />
      ))}
    </Box>
  </Box>
);

export const CommentBlock = ({ icon, title, text }) => (
  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Typography sx={{ fontSize: '1.2rem' }}>{icon}</Typography>
      <Typography variant="body1" fontWeight="600">{title}</Typography>
    </Box>
    <Typography variant="body2" color="text.secondary">{text}</Typography>
  </Box>
);