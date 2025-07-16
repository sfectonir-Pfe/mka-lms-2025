import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import axios from "axios";


const ModuleList = () => {
  const { t } = useTranslation();
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  const fetchModules = async () => {
    try {
      const res = await axios.get("http://localhost:8000/modules");
      setModules(res.data);
    } catch (err) {
      console.error("Erreur chargement modules", err);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('modules.confirmDelete'))) return;
    try {
      await axios.delete(`http://localhost:8000/modules/${id}`);
      setModules((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Erreur suppression", err);
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
        variant="outlined"
        color="error"
        size="small"
        onClick={() => handleDelete(params.row.id)}
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
        <Button variant="contained" onClick={() => navigate("/module/add")}>
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
    </Box>
  );
};

export default ModuleList;
