// src/pages/users/views/ContenusList.js
import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid,Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from 'react-i18next';
import api from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";


const ContenusList = () => {
  const { t } = useTranslation();
  const [contenus, setContenus] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/contenus").then((res) => {
      console.log('Contenus data:', res.data);
      setContenus(res.data);
    });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('content.confirmDelete'))) return;
    try {
      await api.delete(`/contenus/${id}`);
      setContenus((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(t('content.deleteError'));
      console.error(err);
    }
  };

 const columns = [
  { valueGetter: (value) => {
      return "Co-"+value
    },field: "id", headerName: t('table.id'), width: 80 },
  
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
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              color="primary"
              onClick={() => navigate(`/quizzes/play/${params.row.id}`)}
            >
              {t('content.takeQuiz')}
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              onClick={() => navigate(`/quizzes/edit/${params.row.id}`)}
            >
              {t('common.edit')}
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
      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={() => handleDelete(params.row.id)}
      >
        {t('common.delete')}
      </Button>
    ),
  },
];


  return (
    <Box mt={4}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">{t('content.contentList')}</Typography>
        <Button variant="contained" onClick={() => navigate("/contenus/add")}>
          ➕ {t('content.addContent')}
        </Button>
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
    </Box>
  );
};

export default ContenusList;
