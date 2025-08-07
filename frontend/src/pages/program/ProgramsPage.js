import React from "react";
import { Box } from "@mui/material";
import AddProgramList from "../../features/views/program/AddProgramList";
import ProgramList from "../../features/views/program/ProgramList";

import { Routes, Route } from "react-router-dom";

const ProgramsPage = () => {
  return (
    <Box p={2}>
      <Routes>
        <Route index element={<ProgramList />} />
        <Route path="add" element={<AddProgramList />} />
      </Routes>
    </Box>
  );
};

export default ProgramsPage;
