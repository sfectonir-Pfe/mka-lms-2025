import React, { useEffect, useState } from "react";
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem,
  Grid, Paper, Button, Checkbox, FormGroup, FormControlLabel, 
  TextField, Accordion, AccordionSummary, AccordionDetails, Stepper,
  Step, StepLabel, Chip
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const steps = ["Choisir un programme", "Modules, cours et contenus", "Dates et confirmation"];

const ConfigureSessionView = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [programs, setPrograms] = useState([]);
  const [modules, setModules] = useState([]);
  const [coursesByModule, setCoursesByModule] = useState({});
  const [contenusByCourse, setContenusByCourse] = useState({});

  const [programId, setProgramId] = useState("");
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState({});
  const [selectedContenus, setSelectedContenus] = useState({});
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/programs").then(res => setPrograms(res.data));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/modules").then(res => setModules(res.data));
  }, []);

  const handleModuleToggle = async (moduleId) => {
    const alreadySelected = selectedModules.includes(moduleId);
    const updated = alreadySelected
      ? selectedModules.filter(id => id !== moduleId)
      : [...selectedModules, moduleId];

    setSelectedModules(updated);

    if (!alreadySelected && !coursesByModule[moduleId]) {
      const res = await axios.get("http://localhost:8000/courses");
      setCoursesByModule(prev => ({ ...prev, [moduleId]: res.data }));
    }
  };

  const handleCourseToggle = async (moduleId, courseId) => {
    const current = selectedCourses[moduleId] || [];
    const alreadySelected = current.includes(courseId);
    const updated = alreadySelected
      ? current.filter(id => id !== courseId)
      : [...current, courseId];

    setSelectedCourses(prev => ({ ...prev, [moduleId]: updated }));

    if (!alreadySelected && !contenusByCourse[courseId]) {
      const res = await axios.get("http://localhost:8000/contenus");
      setContenusByCourse(prev => ({ ...prev, [courseId]: res.data }));
    }
  };

  const handleContenuToggle = (moduleId, courseId, contenuId) => {
    const key = `${moduleId}-${courseId}`;
    const current = selectedContenus[key] || [];
    const alreadySelected = current.includes(contenuId);
    const updated = alreadySelected
      ? current.filter(id => id !== contenuId)
      : [...current, contenuId];

    setSelectedContenus(prev => ({ ...prev, [key]: updated }));
  };

  const handleSubmit = async () => {
    if (!programId) return alert("Veuillez sélectionner un programme.");
    if (!start || !end) return alert("Veuillez sélectionner une date valide.");
    if (selectedModules.length === 0) return alert("Veuillez sélectionner un module.");

    const payload = {
      programId: Number(programId),
      startDate: new Date(start).toISOString(),
      endDate: new Date(end).toISOString(),
      modules: selectedModules.map((moduleId) => {
        const courseIds = selectedCourses[moduleId] || [];
        return {
          moduleId,
          courses: courseIds.map((courseId) => {
            const key = `${moduleId}-${courseId}`;
            const contenuIds = selectedContenus[key] || [];
            return {
              courseId,
              contenus: contenuIds.map((contenuId) => ({ contenuId })),
            };
          }),
        };
      }),
    };

    try {
      await axios.post("http://localhost:8000/sessions", payload);
      alert("✅ Session enregistrée avec succès !");
      navigate("/sessions");
    } catch {
      alert("❌ Erreur lors de la création de la session.");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 1000, borderRadius: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          🎯 Configurer une Session
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Programme</InputLabel>
            <Select value={programId} onChange={(e) => setProgramId(e.target.value)}>
              {programs.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </Select>
            <Box mt={3} textAlign="right">
              <Button variant="contained" onClick={() => setActiveStep(1)} disabled={!programId}>
                Suivant
              </Button>
            </Box>
          </FormControl>
        )}

        {activeStep === 1 && (
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
              <Button variant="outlined" onClick={() => setActiveStep(0)}>Retour</Button>
              <Button variant="contained" onClick={() => setActiveStep(2)}>Suivant</Button>
            </Box>
          </>
        )}

        {activeStep === 2 && (
          <>
            <Typography variant="h6">🗓️ Dates</Typography>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={6}>
                <TextField fullWidth label="Date de début" type="date" InputLabelProps={{ shrink: true }} value={start} onChange={(e) => setStart(e.target.value)} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Date de fin" type="date" InputLabelProps={{ shrink: true }} value={end} onChange={(e) => setEnd(e.target.value)} />
              </Grid>
            </Grid>

            <Box mt={3}>
              <Typography variant="h6">🔎 Récapitulatif</Typography>
              <Typography variant="body1">Programme : {programs.find(p => p.id === programId)?.name}</Typography>
              {selectedModules.map((mid) => (
                <Box key={mid} mt={1}>
                  <Typography variant="subtitle2">Module: {modules.find(m => m.id === mid)?.name}</Typography>
                  {(selectedCourses[mid] || []).map(cid => (
                    <Chip key={cid} label={`Cours: ${coursesByModule[mid]?.find(c => c.id === cid)?.title}`} sx={{ m: 0.5 }} />
                  ))}
                </Box>
              ))}
            </Box>

            <Box mt={3} display="flex" justifyContent="space-between">
              <Button variant="outlined" onClick={() => setActiveStep(1)}>Retour</Button>
              <Button variant="contained" color="primary" onClick={handleSubmit}>ENREGISTRER</Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ConfigureSessionView;
