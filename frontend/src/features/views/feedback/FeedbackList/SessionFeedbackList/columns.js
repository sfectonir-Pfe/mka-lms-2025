import { Button, Typography } from '@mui/material';
import { formatOneDecimal, moodFromRating, computeWeightedRating } from './utils';

const styles = {
  info: {
    borderRadius: 2,
    background: 'linear-gradient(135deg, #0288d1, #29b6f6)',
    boxShadow: '0 6px 18px rgba(2,136,209,0.25)',
    transition: 'transform 0.15s ease',
    '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(2,136,209,0.35)' }
  }
};

export const buildFeedbackColumns = (t, onShowMore) => [
  { field: 'id', headerName: t('sessions.id'), width: 70 },
  {
    field: 'studentName',
    headerName: t('sessions.studentName'),
    width: 180,
    renderCell: (params) => {
      const studentName = params.row.studentName;
      // Afficher vide si le nom est null, undefined, vide, ou contient "unknown"
      if (!studentName || studentName === '' || studentName.toLowerCase().includes('unknown') || studentName.toLowerCase().includes('inconnu')) {
        return <Typography variant="body2"></Typography>;
      }
      return <Typography variant="body2">{studentName}</Typography>;
    },
  },
  { field: 'studentEmail', headerName: t('sessions.studentEmail'), width: 220 },
  {
    field: 'fullFeedback',
    headerName: t('sessions.fullFeedback'),
    width: 180,
    renderCell: (params) => (
      <Button size="small" variant="contained" onClick={() => onShowMore(params.row.userId)} sx={styles.info}>
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