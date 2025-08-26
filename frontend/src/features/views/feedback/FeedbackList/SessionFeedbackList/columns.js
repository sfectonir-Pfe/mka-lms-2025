import { Button, Typography } from '@mui/material';
import { formatOneDecimal, moodFromRating, computeWeightedRating } from './utils';

export const buildFeedbackColumns = (t, onShowMore) => [
  { field: 'id', headerName: t('sessions.id'), width: 70 },
  {
    field: 'studentName',
    headerName: t('sessions.studentName'),
    width: 180,
    renderCell: (params) => (
      <Typography variant="body2">
        {params.row.studentName || t('sessions.unknown')}
      </Typography>
    ),
  },
  { field: 'studentEmail', headerName: t('sessions.studentEmail'), width: 220 },
  {
    field: 'fullFeedback',
    headerName: t('sessions.fullFeedback'),
    width: 150,
    renderCell: (params) => (
      <Button size="small" variant="contained" color="primary" onClick={() => onShowMore(params.row.userId)} sx={{ minWidth: 'auto', px: 2, py: 1, fontSize: '0.8rem' }}>
        {t('sessions.fullFeedback')}
      </Button>
    ),
  },
  {
    field: 'averageRating',
    headerName: t('sessions.averageRating'),
    width: 200,
    renderCell: (params) => {
      const rating = computeWeightedRating(params.row);
      if (!rating) {
        return (
          <Typography variant="body2" color="text.secondary" fontStyle="italic">
            {t('sessions.notRated')}
          </Typography>
        );
      }
      const { label, emoji } = moodFromRating(rating, t);
      return (
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 22 }}>{emoji}</span>
          <span style={{ fontWeight: 'bold', marginLeft: 4 }}>{label}</span>
          <span style={{ color: '#888', marginLeft: 4 }}>({formatOneDecimal(rating)})</span>
        </span>
      );
    },
  },
];