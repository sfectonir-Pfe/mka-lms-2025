import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ModuleList = () => {
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
    if (!window.confirm("Supprimer ce module ?")) return;
    try {
      await axios.delete(`http://localhost:8000/modules/${id}`);
      setModules((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Erreur suppression", err);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Nom du module", flex: 1 },
    { field: "periodUnit", headerName: "Période", width: 120 },
    { field: "duration", headerName: "Durée", width: 100 },
    {
  field: "actions",
  headerName: "Actions",
  flex: 1,
  renderCell: (params) => (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={() => navigate(`/modules/${params.row.id}/courses`)}
        style={{ marginRight: 8 }}
      >
        Voir Cours
      </Button>

      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={() => handleDelete(params.row.id)}
      >
        Supprimer
      </Button>
    </>
  ),
}

  ];

  return (
    <Box mt={4}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Liste des modules</Typography>
        <Button variant="contained" onClick={() => navigate("/module/add")}>
  ➕ Ajouter un module
</Button>

      </Grid>

      <Box sx={{ height: 400 }}>
        <DataGrid
          rows={modules}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default ModuleList;
