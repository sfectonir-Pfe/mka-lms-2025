// src/pages/ContenusPage.js
import { Routes, Route } from "react-router-dom";
import ContenusList from "../../features/views/contenu/ContenusList";
import AddContenusView from "../../features/views/contenu/AddContenusView";

const ContenusPage = () => {
  return (
    <Routes>
      <Route index element={<ContenusList />} />
      <Route path="add" element={<AddContenusView />} />
    </Routes>
  );
};

export default ContenusPage;
