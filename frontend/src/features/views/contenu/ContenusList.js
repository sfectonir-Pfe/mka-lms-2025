// src/pages/users/views/ContenusList.js
import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid, Stack, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import RoleGate from "../../../pages/auth/RoleGate";

const ContenusList = () => {
  const { t } = useTranslation();
  const [contenus, setContenus] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, title: '' });
  const navigate = useNavigate();

  const styles = {
    primary: {
      borderRadius: 3,
      background: "linear-gradient(135deg, #1976d2, #42a5f5)",
      boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 12px 32px rgba(25,118,210,0.4)'
      }
    },
    danger: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #d32f2f, #ef5350)',
      boxShadow: '0 6px 18px rgba(211,47,47,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(211,47,47,0.35)' }
    },
    success: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
      boxShadow: '0 6px 18px rgba(46,125,50,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(46,125,50,0.35)' }
    },
    info: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #0288d1, #29b6f6)',
      boxShadow: '0 6px 18px rgba(2,136,209,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(2,136,209,0.35)' }
    },
    secondary: {
      borderRadius: 2,
      background: 'linear-gradient(135deg, #7b1fa2, #ab47bc)',
      boxShadow: '0 6px 18px rgba(123,31,162,0.25)',
      transition: 'transform 0.15s ease',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(123,31,162,0.35)' }
    },
    rounded: { borderRadius: 2 }
  };

  useEffect(() => {
    api.get("/contenus").then((res) => {
      console.log('Contenus data:', res.data);
      setContenus(res.data);
    });
  }, []);

  const handleDelete = async (id) => {
    const contenu = contenus.find(c => c.id === id);
    setDeleteDialog({ open: true, id, title: contenu?.title || 'Contenu' });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/contenus/${deleteDialog.id}`);
      setContenus((prev) => prev.filter((c) => c.id !== deleteDialog.id));
      toast.success(t('content.deleteSuccess'));
      setDeleteDialog({ open: false, id: null, title: '' });
    } catch (err) {
      toast.error(t('content.deleteError'));
      console.error(err);
      setDeleteDialog({ open: false, id: null, title: '' });
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, id: null, title: '' });
  };

  const columns = [
    {
      valueGetter: (value) => {
        return "Co-" + value
      }, field: "id", headerName: t('table.id'), width: 80
    },

    { field: "title", headerName: t('content.title'), flex: 1 },
    { field: "type", headerName: t('content.type'), width: 130 },
    { field: "fileType", headerName: t('content.file'), width: 130 },
    {
      field: "coursAssocie",
      headerName: t('common.associatedCourse'),
      width: 200,
      renderCell: (params) => {
        console.log('Row data:', params.row);

        // Check buildProgramContenus for associated courses (from built programs)
        const buildProgramCourses = params.row.buildProgramContenus?.map(bpc => bpc.buildProgramCourse?.course?.title).filter(Boolean) || [];

        // Check courseContenus for direct course associations
        const directCourses = params.row.courseContenus?.map(cc => cc.course?.title).filter(Boolean) || [];

        // Check coursAssocie field
        const coursAssocieValue = params.row.coursAssocie;

        if (buildProgramCourses.length > 0) {
          return buildProgramCourses.join(', ');
        } else if (directCourses.length > 0) {
          return directCourses.join(', ');
        } else if (coursAssocieValue) {
          return coursAssocieValue;
        } else {
          return '-';
        }
      }
    },
    {
      field: "fileUrl",
      headerName: t('content.link'),
      flex: 1,
      renderCell: (params) => {
        const isQuiz = params.row.type === "Quiz";

        if (isQuiz) {
          return (
            <RoleGate roles={['CreateurDeFormation', 'Admin']}>
              <Button
                variant="contained"
                size="small"
                sx={styles.secondary}
                onClick={() => navigate(`/quizzes/edit/${params.row.id}`)}
              >
                {t('common.edit')}
              </Button>
            </RoleGate>
          );
        } else {
          return params.row.fileUrl ? (
            <Button
              variant="contained"
              size="small"
              sx={styles.info}
              onClick={() => window.open(params.row.fileUrl, "_blank")}
            >
              {t('content.view')}
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('content.noFile')}
            </Typography>
          );
        }
      },
    },
    {
      field: "actions",
      headerName: t('content.actions'),
      flex: 1,
      renderCell: (params) => (
        <RoleGate roles={['CreateurDeFormation', 'Admin']}>
          <Button
            variant="contained"
            size="small"
            sx={styles.danger}
            onClick={() => handleDelete(params.row.id)}
          >
            {t('common.delete')}
          </Button>
        </RoleGate>
      ),
    },
  ];


  return (
    <Box mt={4}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">{t('content.contentList')}</Typography>
        <RoleGate roles={['CreateurDeFormation', 'Admin']}>
        <Button variant="contained" onClick={() => navigate("/contenus/add")} sx={styles.primary}>
        ➕ {t('content.addContent')}
      </Button>
    </RoleGate>
  </Grid>

    <Box sx={{ height: 500 }}>
      <DataGrid
        rows={contenus}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 100]}
        getRowId={(row) => row.id}
        localeText={{
          noRowsLabel: t('table.noRows'),
          labelRowsPerPage: t('table.rowsPerPage')
        }}
      />
    </Box>

    <Dialog open={deleteDialog.open} onClose={handleCloseDeleteDialog}>
      <DialogTitle>{t('content.confirmDeleteTitle', { title: deleteDialog.title })}</DialogTitle>
      <DialogContent>
        {t('content.confirmDeleteMessage', { title: deleteDialog.title })}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteDialog} color="primary">
          {t('common.cancel')}
        </Button>
        <Button onClick={confirmDelete} color="error" variant="contained">
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
    </Box >
  );
};

export default ContenusList;
