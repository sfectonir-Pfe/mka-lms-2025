import React from "react";
import { Routes, Route } from "react-router-dom";
import ConfigureSessionList from "./users/views/ConfigureSessionList";
import ConfigureSessionView from "./users/views/ConfigureSessionView";

const ConfigureSessionPage = () => {
  return (
    <Routes>
      <Route path="/" element={<ConfigureSessionList />} />
      <Route path="add" element={<ConfigureSessionView />} />
    </Routes>
  );
};

export default ConfigureSessionPage;