import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddCourseModal from "./users/views/AddCourseModal";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const CoursPage = () => {
  const { id } = useParams();
  const moduleId = Number(id);
  const [courses, setCourses] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!moduleId) return;
    axios
      .get(`http://localhost:8000/courses/module/${moduleId}`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Erreur chargement cours:", err));
  }, [moduleId]);

  const handleAddCourse = (course) => {
    setCourses((prev) => [...prev, course]);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Supprimer ce cours ?")) return;
    try {
      await axios.delete(`http://localhost:8000/courses/${courseId}`);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err) {
      console.error("Erreur suppression cours", err);
      alert("Impossible de supprimer le cours.");
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">
          📚 Cours du module <span className="text-primary">{moduleId}</span>
        </h3>
        <button
          className="btn btn-success rounded-pill px-4 shadow d-flex align-items-center gap-2"
          onClick={() => setOpenModal(true)}
        >
          <AddIcon style={{ fontSize: "1.2rem" }} />
          Ajouter un cours
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="alert alert-info text-center">
          Aucun cours ajouté pour le moment.
        </div>
      ) : (
        <div className="row">
          {courses.map((course) => (
            <div className="col-md-4 mb-4" key={course.id}>
              <div className="card h-100 border-0 shadow rounded-4 overflow-hidden">
                <div className="bg-light" style={{ height: "180px", overflow: "hidden" }}>
                  {course.type === "IMAGE" ? (
                    <img
                      src={course.fileUrl}
                      alt={course.title}
                      className="w-100 h-100 object-fit-cover"
                      onError={(e) => (e.target.src = "/assets/image-error.png")}
                    />
                  ) : course.type === "VIDEO" ? (
                    <video
                      src={course.fileUrl}
                      controls
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <div className="d-flex justify-content-center align-items-center h-100">
                      <img
                        src="/assets/pdf-icon.png"
                        alt="PDF"
                        style={{ height: "60px" }}
                      />
                    </div>
                  )}
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title mb-2">{course.title}</h5>
                  <p className="text-muted small mb-3">Type : {course.type}</p>
                  <button
                    className="btn btn-outline-primary btn-sm rounded-pill px-4 me-2"
                    onClick={() => window.open(course.fileUrl, "_blank")}
                  >
                    Voir le fichier
                  </button>
                  <button
                    className="btn btn-danger btn-sm rounded-pill px-3"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <DeleteIcon style={{ fontSize: "1rem" }} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddCourseModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={handleAddCourse}
        moduleId={moduleId}
      />
    </div>
  );
};

export default CoursPage;
