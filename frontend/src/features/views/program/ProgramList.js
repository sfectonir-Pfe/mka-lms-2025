import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RoleGate from "../../../pages/auth/RoleGate";
const ProgramList = () => {
  const { t } = useTranslation();
  const [programs, setPrograms] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null, name: '' });
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

  const fetchPrograms = async () => {
    try {
      const res = await api.get("/programs");
      setPrograms(res.data);
    } catch (err) {
      console.error(t('programs.loadError'), err);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleDelete = async (id) => {
    const program = programs.find(p => p.id === id);
    setDeleteDialog({ open: true, id, name: program?.name || 'Programme' });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/programs/${deleteDialog.id}`);
      setPrograms((prev) => prev.filter((p) => p.id !== deleteDialog.id));
      toast.success(t('programs.deleteSuccess'));
      setDeleteDialog({ open: false, id: null, name: '' });
    } catch (err) {
      toast.error(t('programs.deleteError'));
      console.error(err);
      setDeleteDialog({ open: false, id: null, name: '' });
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, id: null, name: '' });
  };

  const columns = [
    { 
      valueGetter: (value) => {
        return "P-"+value
      },
      field: "id", 
      headerName: t('table.id'), 
      width: 80 
    },
    { 
      field: "name", 
      headerName: t('programs.programName'), 
      flex: 1 
    },
    {
      field: "sessionsAssociees",
      headerName: t('programs.associatedSessions'),  // Changed translation key to 'programs.associatedSessions'
      width: 200,
      renderCell: (params) => {
        if (!params || !params.row) {
          return '-';
        }
        
        // Safely access buildProgram sessions
        const buildProgramSessions = params.row.buildProgram?.sessions?.map(session => session?.name)?.filter(Boolean) || [];
        
        // Safely access direct sessions
        const directSessions = params.row.sessions2?.map(s => s?.name)?.filter(Boolean) || [];
        
        // Combine both sources and remove duplicates
        const allSessions = [...new Set([...buildProgramSessions, ...directSessions])];
        
        return allSessions.length > 0 ? allSessions.join(', ') : '-';
      }
    },
    {
      field: "actions",
      headerName: t('common.actions'),
      flex: 1,
      renderCell: (params) => (
        <>
         <Button
  variant="contained"
  size="small"
  sx={styles.info}
  onClick={() => navigate(`/programs/overview/${params.row.id}`)}
>
  {t('programs.viewProgram')}
</Button>

          <RoleGate roles={['CreateurDeFormation','Admin']}>
          <Button
            variant="contained"
            size="small"
            sx={{ ...styles.danger, ml: 1 }}
            onClick={() => handleDelete(params.row.id)}
          >
            {t('common.delete')}
          </Button>
          </RoleGate>
        </>
      ),
    },
  ];

  return (
    <Box mt={4}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">{t('programs.programList')}</Typography>

        <Box>
        <RoleGate roles={['CreateurDeFormation','Admin']}>
          <Button
            variant="contained"
            onClick={() => navigate("/programs/add")}
            sx={{ mr: 2 }}
          >
            ➕ {t('programs.addProgram')}
          </Button>
          </RoleGate>
          <Button
            variant="contained"
            startIcon={<VisibilityIcon />}
            sx={styles.secondary}
            onClick={() => navigate("/programs/overview")}
          >
            {t('programs.viewPrograms')}
          </Button>
          </Box>
      </Grid>


      <Box sx={{ height: 400 }}>
        <DataGrid
          rows={programs}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.id}
          localeText={{
            noRowsLabel: t('table.noRows'),
            labelRowsPerPage: t('table.rowsPerPage')
          }}
        />
      </Box>

      <Dialog open={deleteDialog.open} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{t('programs.confirmDeleteTitle')}</DialogTitle>
        <DialogContent>
          {t('programs.confirmDeleteMessage', { name: deleteDialog.name })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            {t('common.cancel')}
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" sx={styles.danger}>
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProgramList;