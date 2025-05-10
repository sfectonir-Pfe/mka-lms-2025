import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/programs").then((res) => {
      setPrograms(res.data);
    });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/programs/${id}`).then(() => {
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Titre", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button
  className="btn btn-sm btn-outline-info mx-1"
  onClick={() => navigate(`/programs/${params.row.id}/modules`)}
>
  Voir Modules
</Button>

<Button
  className="btn btn-sm btn-outline-danger mx-1"
  onClick={() => handleDelete(params.row.id)}
>
  Supprimer
</Button>
        </div>
      ),
    },
  ];

  return (
    <Box mt={5}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Liste des programmes</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/programs/add")}
        >
          Ajouter un programme
        </Button>
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
