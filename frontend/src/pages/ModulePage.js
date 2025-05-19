import React from "react";
import { Routes, Route } from "react-router-dom";
import ModuleList from "./users/views/ModuleList";
import AddModuleView from "./users/views/AddModuleView";


const ModulePage = () => {
  return (
    <Routes>
      <Route index element={<ModuleList />} />
      <Route path="add" element={<AddModuleView />} />
    </Routes>
  );
};

export default ModulePage;
