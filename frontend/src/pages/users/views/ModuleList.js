import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import axios from "axios";


const ModuleList = () => {
  const { i18n } = useTranslation();
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();
  
  const getText = (key) => {
    const translations = {
      confirmDelete: {
        fr: 'Êtes-vous sûr de vouloir supprimer ce module ?',
        en: 'Are you sure you want to delete this module?',
        ar: 'هل أنت متأكد من حذف هذه الوحدة؟'
      },
      moduleName: {
        fr: 'Nom du Module',
        en: 'Module Name', 
        ar: 'اسم الوحدة'
      },
      period: {
        fr: 'Période',
        en: 'Period',
        ar: 'الفترة'
      },
      duration: {
        fr: 'Durée',
        en: 'Duration',
        ar: 'المدة'
      },
      actions: {
        fr: 'Actions',
        en: 'Actions',
        ar: 'الإجراءات'
      },
      viewCourses: {
        fr: 'Voir Cours',
        en: 'View Courses',
        ar: 'عرض الدروس'
      },
      delete: {
        fr: 'Supprimer',
        en: 'Delete',
        ar: 'حذف'
      },
      moduleList: {
        fr: 'Liste des Modules',
        en: 'Module List',
        ar: 'قائمة الوحدات'
      },
      addModule: {
        fr: 'Ajouter Module',
        en: 'Add Module',
        ar: 'إضافة وحدة'
      }
    };
    return translations[key][i18n.language] || translations[key]['en'];
  };

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
    if (!window.confirm(getText('confirmDelete'))) return;
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
     field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: getText('moduleName'), flex: 1 },
    { field: "periodUnit", headerName: getText('period'), width: 120 },
    { field: "duration", headerName: getText('duration'), width: 100 },
    {
  field: "actions",
  headerName: getText('actions'),
  flex: 1,
  renderCell: (params) => (
    <>
      <Button
        variant="outlined"
        size="small"
        onClick={() => navigate(`/modules/${params.row.id}/courses`)}
        style={{ marginRight: 8 }}
      >
        {getText('viewCourses')}
      </Button>

      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={() => handleDelete(params.row.id)}
      >
        {getText('delete')}
      </Button>
    </>
  ),
}

  ];

  return (
    <Box mt={4}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">{getText('moduleList')}</Typography>
        <Button variant="contained" onClick={() => navigate("/module/add")}>
  ➕ {getText('addModule')}
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
