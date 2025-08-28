import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";


const ModuleList = () => {
  const { t } = useTranslation();
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, module: null });

  const fetchModules = async () => {
    try {
      const res = await api.get("/modules");
      setModules(res.data);
    } catch (err) {
      console.error("Erreur chargement modules", err);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const confirmDelete = (moduleRow) => {
    setDeleteDialog({ open: true, module: moduleRow });
  };

  const handleDelete = async () => {
    const mod = deleteDialog.module;
    if (!mod) return;
    try {
      await api.delete(`/modules/${mod.id}`);
      setModules((prev) => prev.filter((m) => m.id !== mod.id));
      toast.success(t('modules.deleteSuccess'));
    } catch (err) {
      console.error("Erreur suppression", err);
      toast.error(t('modules.deleteError'));
    } finally {
      setDeleteDialog({ open: false, module: null });
    }
  };

  const columns = [
    { valueGetter: (value) => {
      return "M-"+value
    },
     field: "id", headerName: t('table.id'), width: 80 },
    { field: "name", headerName: t('modules.moduleName'), flex: 1 },
    { field: "periodUnit", headerName: t('modules.period'), width: 120 },
    { field: "duration", headerName: t('modules.duration'), width: 100 },
    { 
      field: "programmeAssocie", 
      headerName: t('common.associatedProgram'), 
      width: 200,
      renderCell: (params) => {
        // Check buildProgramModules for associated programs (from built programs)
        const buildPrograms = params.row.buildProgramModules?.map(bpm => bpm.buildProgram?.program?.name).filter(Boolean) || [];
        
        // Check programs for direct program associations
        const directPrograms = params.row.programs?.map(pm => pm.program?.name).filter(Boolean) || [];
        
        if (buildPrograms.length > 0) {
          return buildPrograms.join(', ');
        } else if (directPrograms.length > 0) {
          return directPrograms.join(', ');
        } else {
          return '-';
        }
      }
    },
    {
  field: "actions",
  headerName: t('modules.actions'),
  flex: 1,
  renderCell: (params) => (
    <>
      <Button
        variant="contained"
        color="error"
        size="small"
        onClick={() => confirmDelete(params.row)}
        sx={{
          borderRadius: 2,
          background: 'linear-gradient(135deg, #d32f2f, #ef5350)',
          boxShadow: '0 6px 18px rgba(211,47,47,0.25)',
          transition: 'transform 0.15s ease',
          '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 10px 24px rgba(211,47,47,0.35)' }
        }}
      >
        {t('common.delete')}
      </Button>
    </>
  ),
}
  ];

  return (
    <Box mt={4}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">{t('modules.moduleList')}</Typography>
        <Button variant="contained" onClick={() => navigate("/module/add")}
          sx={{
            borderRadius: 3,
            background: "linear-gradient(135deg, #1976d2, #42a5f5)",
            boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(25,118,210,0.4)' }
          }}
        >
  ➕ {t('modules.addModule')}
</Button>

      </Grid>

      <Box sx={{ height: 400 }}>
        <DataGrid
          rows={modules}
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

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, module: null })}
      >
        <DialogTitle>{t('modules.confirmDelete')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('modules.deleteConfirmMessage', { name: deleteDialog.module?.name || '' })}
            <br />
            <br />
            {t('users.irreversibleAction')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, module: null })} sx={{ borderRadius: 2 }}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" sx={{ borderRadius: 2, minWidth: 120 }}>
            {t('modules.deleteButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ModuleList;
