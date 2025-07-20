import React from "react";
import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Typography, Box } from "@mui/material";
import ModuleList from "./users/views/ModuleList";
import AddModuleView from "./users/views/AddModuleView";

const ModulePage = () => {
  const { i18n } = useTranslation();
  
  const getTitle = () => {
    switch(i18n.language) {
      case 'fr': return 'Modules';
      case 'ar': return 'وحدات';
      default: return 'Modules';
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {getTitle()}
      </Typography>
      <Routes>
        <Route index element={<ModuleList />} />
        <Route path="add" element={<AddModuleView />} />
      </Routes>
    </Box>
  );
};

export default ModulePage;
