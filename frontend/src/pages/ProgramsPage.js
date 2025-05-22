import React from "react";
import { Box } from "@mui/material";
import AddProgramList from "./users/views/AddProgramList";
import ProgramList from "./users/views/ProgramList";

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
