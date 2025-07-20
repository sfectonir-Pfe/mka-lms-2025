// src/pages/ContenusPage.js
import { Routes, Route } from "react-router-dom";
import ContenusList from "./users/views/ContenusList";
import AddContenusView from "./users/views/AddContenusView";

const ContenusPage = () => {
  return (
    <Routes>
      <Route index element={<ContenusList />} />
      <Route path="add" element={<AddContenusView />} />
    </Routes>
  );
};

export default ContenusPage;
