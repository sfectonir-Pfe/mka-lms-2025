import React, { useEffect, useState } from "react";
import {
  Box, Typography, FormControl, InputLabel, Select, MenuItem,
  Grid, Paper, Button, Checkbox, FormGroup, FormControlLabel, Divider,
  TextField
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfigureSessionView = () => {
  const navigate = useNavigate();

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

  // Load all programs
  useEffect(() => {
    axios.get("http://localhost:8000/programs")
      .then(res => setPrograms(res.data));
  }, []);

  // Load all modules regardless of program
  useEffect(() => {
    axios.get("http://localhost:8000/modules")
      .then(res => {
        console.log("📦 All modules:", res.data);
        setModules(res.data);
      });
  }, []);

 const handleModuleToggle = async (moduleId) => {
  const alreadySelected = selectedModules.includes(moduleId);
  const updated = alreadySelected
    ? selectedModules.filter(id => id !== moduleId)
    : [...selectedModules, moduleId];

  setSelectedModules(updated);

  if (!alreadySelected && !coursesByModule[moduleId]) {
const res = await axios.get(`http://localhost:8000/courses`);
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
    const res = await axios.get(`http://localhost:8000/contenus`);

    setContenusByCourse(prev => ({ ...prev, [courseId]: res.data }));
  }
};


  const handleContenuToggle = (courseId, contenuId) => {
    const current = selectedContenus[courseId] || [];
    const alreadySelected = current.includes(contenuId);
    const updated = alreadySelected
      ? current.filter(id => id !== contenuId)
      : [...current, contenuId];

    setSelectedContenus(prev => ({ ...prev, [courseId]: updated }));
  };

  const handleSubmit = async () => {
  if (!programId) {
    alert("Veuillez sélectionner un programme.");
    return;
  }

  if (!start || !end) {
    alert("Veuillez sélectionner une date de début et de fin.");
    return;
  }

  if (selectedModules.length === 0) {
    alert("Veuillez sélectionner au moins un module.");
    return;
  }

  const payload = {
    programId: Number(programId),
    startDate: new Date(start).toISOString(),
    endDate: new Date(end).toISOString(),
    modules: selectedModules.map((moduleId) => {
      const courseIds = selectedCourses[moduleId] || [];

      return {
        moduleId,
        courses: courseIds.map((courseId) => {
          const contenuIds = selectedContenus[courseId] || [];

          return {
            courseId,
            contenus: contenuIds.map((contenuId) => ({ contenuId })),
          };
        }),
      };
    }),
  };

  try {
    const res = await axios.post("http://localhost:8000/sessions", payload);
    console.log("✅ Session created:", res.data);
    alert("✅ Session enregistrée avec succès !");
  } catch (err) {
    console.error("❌ Session creation failed:", err);
    alert("❌ Erreur lors de la création de la session.");
  }
};


  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
      <Paper sx={{ p: 4, width: 900, borderRadius: 4, bgcolor: "#f9f9f9" }}>
        <Typography variant="h5" align="center" gutterBottom>
          🎯 Configurer une Session
        </Typography>

        {/* Program Selector */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Programme</InputLabel>
          <Select value={programId} onChange={(e) => setProgramId(e.target.value)}>
            {programs.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Module Checkboxes */}
        {modules.length > 0 && (
          <>
            <Typography variant="h6" mt={3}>📦 Sélectionner les Modules</Typography>
            <FormGroup>
              {modules.map((m) => (
                <FormControlLabel
                  key={m.id}
                  control={
                    <Checkbox
                      checked={selectedModules.includes(m.id)}
                      onChange={() => handleModuleToggle(m.id)}
                    />
                  }
                  label={m.name}
                />
              ))}
            </FormGroup>
          </>
        )}

        {/* Courses & Contenus */}
        {selectedModules.map((moduleId) => (
          <Box key={moduleId} mt={3}>
            <Divider />
            <Typography variant="subtitle1" mt={2}>
              🧩 Cours pour module: <strong>{modules.find(m => m.id === moduleId)?.name}</strong>
            </Typography>
            {(coursesByModule[moduleId] || []).map((course) => (
              <Box key={course.id} ml={3} mt={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={(selectedCourses[moduleId] || []).includes(course.id)}
                      onChange={() => handleCourseToggle(moduleId, course.id)}
                    />
                  }
                  label={course.title}
                />

                {(selectedCourses[moduleId] || []).includes(course.id) &&
                  contenusByCourse[course.id]?.length > 0 && (
                    <Box ml={4}>
                      <Typography variant="body2">📄 Contenus :</Typography>
                      <FormGroup>
                        {contenusByCourse[course.id].map((ct) => (
                          <FormControlLabel
                            key={ct.id}
                            control={
                              <Checkbox
                                checked={(selectedContenus[course.id] || []).includes(ct.id)}
                                onChange={() => handleContenuToggle(course.id, ct.id)}
                              />
                            }
                            label={ct.title}
                          />
                        ))}
                      </FormGroup>
                    </Box>
                  )}
              </Box>
            ))}
          </Box>
        ))}

        {/* Date Pickers */}
        <Grid container spacing={2} mt={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Date de début"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Date de fin"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </Grid>
        </Grid>

        {/* Buttons */}
        <Grid container spacing={2} mt={3}>
          <Grid item xs={6}>
            <Button fullWidth variant="outlined" color="secondary" onClick={() => navigate("/sessions")}>
              ANNULER
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth variant="contained" onClick={handleSubmit}>
              ENREGISTRER
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ConfigureSessionView;
