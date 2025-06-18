// src/pages/users/views/ContenusList.js
import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid,Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const ContenusList = () => {
  const [contenus, setContenus] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/contenus").then((res) => {
      setContenus(res.data);
    });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce contenu ?")) return;
    try {
      await axios.delete(`http://localhost:8000/contenus/${id}`);
      setContenus((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression");
      console.error(err);
    }
  };

 const columns = [
  { valueGetter: (value) => {

      return "Co-"+value
    },field: "id", headerName: "ID", width: 80 },
  
  { field: "title", headerName: "Titre", flex: 1 },
  { field: "type", headerName: "Type", width: 130 },
  { field: "fileType", headerName: "Fichier", width: 130 },
  {
    field: "fileUrl",
    headerName: "Lien",
    flex: 1,
    renderCell: (params) => {
      const isQuiz = params.row.type === "Quiz";

      if (isQuiz) {
        return (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => navigate(`/quizzes/play/${params.row.id}`)}
            >
              Prendre le quiz
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={() => navigate(`/quizzes/edit/${params.row.id}`)}
            >
              Modifier
            </Button>
          </Stack>
        );
      } else {
        return params.row.fileUrl ? (
          <Button
            variant="outlined"
            size="small"
            color="info"
            onClick={() => window.open(params.row.fileUrl, "_blank")}
          >
            Voir
          </Button>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Aucun fichier
          </Typography>
        );
      }
    },
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    renderCell: (params) => (
      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={() => handleDelete(params.row.id)}
      >
        Supprimer
      </Button>
    ),
  },
];


  return (
    <Box mt={4}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Liste des contenus</Typography>
        <Button variant="contained" onClick={() => navigate("/contenus/add")}>
          ➕ Ajouter contenu
        </Button>
      </Grid>

      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={contenus}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 100]}
          getRowId={(row) => row.id}
        />
      </Box>
    </Box>
  );
};

export default ContenusList;
