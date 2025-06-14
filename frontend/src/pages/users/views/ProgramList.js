import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  const fetchPrograms = async () => {
    try {
      const res = await axios.get("http://localhost:8000/programs");
      setPrograms(res.data);
    } catch (err) {
      console.error("Erreur chargement programmes", err);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce programme ?")) return;

    try {
      await axios.delete(`http://localhost:8000/programs/${id}`);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Erreur suppression", err);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Nom du programme", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
         <Button
  variant="outlined"
  color="info"
  size="small"
  onClick={() => navigate(`/programs/overview/${params.row.id}`)}
>
  Voir programme
</Button>


          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
            style={{ marginLeft: "8px" }}
          >
            Supprimer
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box mt={4}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Liste des programmes</Typography>

        <Box>
          <Button
            variant="contained"
            onClick={() => navigate("/programs/add")}
            sx={{ mr: 2 }}
          >
            ➕ Ajouter un programme
          </Button>
          <Button
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => navigate("/programs/overview")}
          >
            Voir Programmes
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
        />
      </Box>
    </Box>
  );
};

export default ProgramList;