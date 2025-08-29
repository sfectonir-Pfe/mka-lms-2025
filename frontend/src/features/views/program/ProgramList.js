import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosInstance";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RoleGate from "../../../pages/auth/RoleGate";
const ProgramList = () => {
  const { t } = useTranslation();
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  const fetchPrograms = async () => {
    try {
      const res = await api.get("/programs");
      setPrograms(res.data);
    } catch (err) {
      console.error("Erreur chargement programmes", err);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('programs.confirmDelete'))) return;

    try {
      await api.delete(`/programs/${id}`);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erreur suppression", err);
    }
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
  variant="outlined"
  color="info"
  size="small"
  onClick={() => navigate(`/programs/overview/${params.row.id}`)}
>
  {t('programs.viewProgram')}
</Button>

          <RoleGate roles={['CreateurDeFormation','Admin']}>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
            style={{ marginLeft: "8px" }}
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
            variant="outlined"
            startIcon={<VisibilityIcon />}
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
    </Box>
  );
};

export default ProgramList;