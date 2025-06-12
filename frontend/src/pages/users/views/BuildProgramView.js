import React, { useEffect, useState } from "react";
import {
  Box, Typography, Paper, Button, Checkbox,
  FormGroup, FormControlLabel, Stepper, Step, StepLabel
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const steps = [
  "Modules, cours et contenus",
  "Niveau du programme"
];

const BuildProgramView = () => {
  const navigate = useNavigate();
  const { programId } = useParams();

  const [activeStep, setActiveStep] = useState(0);
  const [modules, setModules] = useState([]);
  const [coursesByModule, setCoursesByModule] = useState({});
  const [contenusByCourse, setContenusByCourse] = useState({});
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState({});
  const [selectedContenus, setSelectedContenus] = useState({});
  const [level, setLevel] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/modules").then(res => setModules(res.data));
  }, []);

  const handleModuleToggle = async (moduleId) => {
    const updated = selectedModules.includes(moduleId)
      ? selectedModules.filter(id => id !== moduleId)
      : [...selectedModules, moduleId];
    setSelectedModules(updated);

    if (!coursesByModule[moduleId]) {
      const res = await axios.get("http://localhost:8000/courses");
      setCoursesByModule(prev => ({ ...prev, [moduleId]: res.data }));
    }
  };

  const handleCourseToggle = async (moduleId, courseId) => {
    const current = selectedCourses[moduleId] || [];
    const updated = current.includes(courseId)
      ? current.filter(id => id !== courseId)
      : [...current, courseId];
    setSelectedCourses(prev => ({ ...prev, [moduleId]: updated }));

    if (!contenusByCourse[courseId]) {
      const res = await axios.get("http://localhost:8000/contenus");
      setContenusByCourse(prev => ({ ...prev, [courseId]: res.data }));
    }
  };

  const handleContenuToggle = (moduleId, courseId, contenuId) => {
    const key = `${moduleId}-${courseId}`;
    const current = selectedContenus[key] || [];
    const updated = current.includes(contenuId)
      ? current.filter(id => id !== contenuId)
      : [...current, contenuId];
    setSelectedContenus(prev => ({ ...prev, [key]: updated }));
  };

  const handleSubmit = async () => {
    if (!programId || !level || selectedModules.length === 0) {
      alert("Veuillez remplir tous les champs nécessaires.");
      return;
    }

    const formData = new FormData();
    formData.append("programId", programId);
    formData.append("level", level);

    formData.append("modules", JSON.stringify(
      selectedModules.map((moduleId) => {
        const courseIds = selectedCourses[moduleId] || [];
        return {
          moduleId,
          courses: courseIds.map((courseId) => {
            const key = `${moduleId}-${courseId}`;
            const contenuIds = selectedContenus[key] || [];
            return {
              courseId,
              contenus: contenuIds.map((contenuId) => ({ contenuId }))
            };
          })
        };
      })
    ));

    try {
      await axios.post("http://localhost:8000/buildProgram", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("✅ Programme construit avec succès !");
      navigate("/programs");
    } catch {
      alert("❌ Erreur lors de la construction du programme.");
    }
  };

  return (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
    <Paper sx={{ p: 4, width: "100%", maxWidth: 1000, borderRadius: 4 }}>
      <Typography variant="h5" align="center" gutterBottom>
        🎓 Construire un Programme
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {activeStep === 0 && (
        <>
          <Typography variant="h6">📦 Sélectionner les Modules</Typography>
          <FormGroup>
            {modules.map((m) => (
              <FormControlLabel
                key={m.id}
                control={<Checkbox checked={selectedModules.includes(m.id)} onChange={() => handleModuleToggle(m.id)} />}
                label={m.name}
              />
            ))}
          </FormGroup>

          {selectedModules.map((moduleId) => (
            <Accordion key={moduleId} sx={{ mt: 2 }} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold">
                  🧩 {modules.find(m => m.id === moduleId)?.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {(coursesByModule[moduleId] || []).map((course) => (
                  <Box key={course.id} ml={2} mt={1}>
                    <FormControlLabel
                      control={<Checkbox checked={(selectedCourses[moduleId] || []).includes(course.id)} onChange={() => handleCourseToggle(moduleId, course.id)} />}
                      label={course.title}
                    />
                    {(selectedCourses[moduleId] || []).includes(course.id) && contenusByCourse[course.id]?.length > 0 && (
                      <Box ml={4} mt={1}>
                        <Typography variant="body2" fontWeight="bold">📄 Contenus :</Typography>
                        <FormGroup>
                          {contenusByCourse[course.id].map((ct) => (
                            <FormControlLabel
                              key={ct.id}
                              control={<Checkbox checked={(selectedContenus[`${moduleId}-${course.id}`] || []).includes(ct.id)} onChange={() => handleContenuToggle(moduleId, course.id, ct.id)} />}
                              label={ct.title}
                            />
                          ))}
                        </FormGroup>
                      </Box>
                    )}
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" color="error" onClick={() => navigate("/programs")}>
              Annuler
            </Button>
            <Button variant="contained" onClick={() => setActiveStep(1)}>
              Suivant
            </Button>
          </Box>
        </>
      )}

      {activeStep === 1 && (
        <>
          <Typography variant="h6">🎯 Niveau du programme</Typography>
          <FormGroup>
            {["Basique", "Intermédiaire", "Avancé"].map((lvl) => (
              <FormControlLabel
                key={lvl}
                control={<Checkbox checked={level === lvl} onChange={() => setLevel(lvl)} />}
                label={lvl}
              />
            ))}
          </FormGroup>

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={() => setActiveStep(0)}>
              Retour
            </Button>
            <Box>
              <Button variant="outlined" color="error" sx={{ mr: 2 }} onClick={() => navigate("/programs")}>
                Annuler
              </Button>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Enregistrer
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  </Box>
);

};

export default BuildProgramView;
