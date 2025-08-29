import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from 'react-i18next';
import api from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import RoleGate from "../../../pages/auth/RoleGate";

const CourseList = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/courses").then((res) => {
      setCourses(res.data);
    });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(t('courses.confirmDelete'))) return;
    await api.delete(`/courses/${id}`);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const columns = [
    { valueGetter: (value) => {

      return "C-"+value
    },field: "id", headerName: t('table.id'), width: 80 },
    { field: "title", headerName: t('common.title'), flex: 1 },
    { 
      field: "moduleAssocie", 
      headerName: t('common.associatedModule'), 
      width: 200,
      renderCell: (params) => {
        // Check buildProgramCourses for associated modules (from built programs)
        const buildProgramModules = params.row.buildProgramCourses?.map(bpc => bpc.buildProgramModule?.module?.name).filter(Boolean) || [];
        
        // Check modules for direct module associations
        const directModules = params.row.modules?.map(mc => mc.module?.name).filter(Boolean) || [];
        
        if (buildProgramModules.length > 0) {
          return buildProgramModules.join(', ');
        } else if (directModules.length > 0) {
          return directModules.join(', ');
        } else {
          return '-';
        }
      }
    },
    {
  field: "actions",
  headerName: t('courses.actions'),
  flex: 1,
  renderCell: (params) => (
    <><RoleGate roles={['CreateurDeFormation','Admin']}>
      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={() => handleDelete(params.row.id)}
      >
        {t('common.delete')}
      </Button>
      </RoleGate>
    </>
  ),
}
 ];

  return (
    <Box mt={4}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">{t('courses.courseList')}</Typography>
        <RoleGate roles={['CreateurDeFormation','Admin']}>
          <Button variant="contained" onClick={() => navigate("/courses/add")}>
            ➕ {t('courses.addCourse')}
          </Button>
        </RoleGate>
      </Grid>

      <Box sx={{ height: 400 }}>
        <DataGrid
          rows={courses}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row.id}
          localeText={{
            noRowsLabel: t('table.noRows'),
            toolbarDensity: t('table.rowsPerPage'),
            rowsPerPage: t('table.rowsPerPage')
          }}
        />
      </Box>
    </Box>
  );
};

export default CourseList;
