import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from 'react-i18next';
import api from "../../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import RoleGate from "../../../pages/auth/RoleGate";

const CourseList = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, course: null });

  useEffect(() => {
    api.get("/courses").then((res) => {
      setCourses(res.data);
    }).catch(() => {
      setCourses([]);
    });
  }, []);

  const confirmDelete = (courseRow) => setDeleteDialog({ open: true, course: courseRow });

  const handleDelete = async () => {
    const course = deleteDialog.course;
    if (!course) return;
    try {
      await api.delete(`/courses/${course.id}`);
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
      toast.success(t('courses.deleteSuccess'));
    } catch (err) {
      console.error("Erreur suppression cours", err);
      toast.error(t('courses.deleteError'));
    } finally {
      setDeleteDialog({ open: false, course: null });
    }
  };

  const columns = [
    {
      valueGetter: (value) => {

        return "C-" + value
      }, field: "id", headerName: t('table.id'), width: 80
    },
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
        <><RoleGate roles={['CreateurDeFormation', ]}>
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
        </RoleGate>
        </>
      ),
    }
  ];

  return (
    <Box mt={4}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">{t('courses.courseList')}</Typography>
        <RoleGate roles={['CreateurDeFormation',]}>
          <Button variant="contained" onClick={() => navigate("/courses/add")}
            sx={{
              borderRadius: 3,
              background: "linear-gradient(135deg, #1976d2, #42a5f5)",
              boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 32px rgba(25,118,210,0.4)' }
            }}
          >
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

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, course: null })}>
        <DialogTitle>{t('courses.confirmDelete')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('courses.deleteConfirmMessage', { title: deleteDialog.course?.title || '' })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, course: null })} sx={{ borderRadius: 2 }}>{t('common.cancel')}</Button>
          <Button onClick={handleDelete} color="error" variant="contained" sx={{ borderRadius: 2, minWidth: 120 }}>{t('courses.deleteButton')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseList;
