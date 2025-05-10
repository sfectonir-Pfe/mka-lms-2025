import React from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ModuleList = ({ modules, setModules, programId }) => {
  const navigate = useNavigate();

  const handleVoirCours = (id) => {
    navigate(`/module/cours/${id}`);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer ce module ?");
    if (!confirm) return;
  
    await axios.delete(`http://localhost:8000/modules/${id}`);
    setModules((prev) => prev.filter((m) => m.id !== id));
  };
  

  const columns = [
    { field: "name", headerName: "Titre", flex: 1 },
    { field: "startDate", headerName: "Date début", flex: 1 },
    { field: "endDate", headerName: "Date fin", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div className="d-flex gap-2">
          <Button
            size="small"
            color="primary"
            onClick={() => handleVoirCours(params.row.id)}
          >
            Voir Cours
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
          >
            Supprimer
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Box mt={4}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Liste des modules</Typography>
        <Button
          variant="contained"
          onClick={() => navigate(`/module/add/${programId}`)}
        >
          Ajouter un module
        </Button>
      </Grid>

      <DataGrid
        rows={modules}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
        getRowId={(row) => row.id}
      />
    </Box>
  );
};

export default ModuleList;
