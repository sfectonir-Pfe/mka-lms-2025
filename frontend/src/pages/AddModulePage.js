import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "@mui/material";
import AddCourseModal from "./users/views/AddCourseModal";
import axios from "axios";

const AddModulePage = () => {
  const { programId } = useParams();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/modules", {
        name,
        startDate,
        endDate,
        programId: parseInt(programId),
      });
      navigate(`/programs/${programId}/modules`);
    } catch (err) {
      console.error("Error saving module:", err);
    }
  };

  return (
    <Container className="mt-5">
      <div className="bg-white shadow p-4 rounded mx-auto" style={{ maxWidth: 700 }}>
        <h3 className="mb-4">Ajouter un module</h3>

        <div className="mb-3">
          <label className="form-label">Titre :</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Date début :</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Date fin :</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="d-grid">
          <button className="btn btn-primary" onClick={handleSubmit}>
            Enregistrer le module
          </button>
        </div>
      </div>

      <AddCourseModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={() => {}}
      />
    </Container>
  );
};

export default AddModulePage;
